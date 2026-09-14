// Calendar credentials stay on the server. Only available slots leave this module.
const API = 'https://www.googleapis.com/calendar/v3';
const minute = 60000;
export class CalendarError extends Error {
  constructor(message, status = 503) { super(message); this.status = status; }
}
function credentials(env) {
  let saved = {};
  try { saved = JSON.parse(env.GOOGLE_CALENDAR_SECRET || '{}'); } catch { /* Invalid secrets leave the integration disabled. */ }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  return {
    clientId: env.GOOGLE_CLIENT_ID || saved.clientId,
    clientSecret: env.GOOGLE_CLIENT_SECRET || saved.clientSecret,
    refreshToken: env.GOOGLE_REFRESH_TOKEN || saved.refreshToken,
    calendarId: env.GOOGLE_CALENDAR_ID || saved.calendarId || 'primary',
  };
}
export function validTimeZone(value) {
  if (typeof value !== 'string' || value.length > 100) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: value }).format(); return Boolean(value); } catch { return false; }
}
const integer = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
export function calendarRules(env = {}) {
  let rules;
  try { rules = JSON.parse(env.GOOGLE_CALENDAR_RULES || 'null'); } catch { return null; }
  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) return null;
  const fields = ['timeZone', 'durationMinutes', 'weekdays', 'startTime', 'endTime', 'noticeHours', 'bufferMinutes', 'horizonDays'];
  if (Object.keys(rules).some(key => !fields.includes(key)) || fields.some(key => !Object.hasOwn(rules, key))) return null;
  if (!validTimeZone(rules.timeZone) || !integer(rules.durationMinutes, 15, 120) || !integer(rules.noticeHours, 1, 168) || !integer(rules.bufferMinutes, 0, 120) || !integer(rules.horizonDays, 1, 60)) return null;
  if (!Array.isArray(rules.weekdays) || !rules.weekdays.length || rules.weekdays.length > 7 || rules.weekdays.some(day => !integer(day, 0, 6))) return null;
  const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!time.test(rules.startTime) || !time.test(rules.endTime) || rules.startTime >= rules.endTime) return null;
  return rules;
}
export function googleCalendarStatus(env = {}) {
  const config = credentials(env);
  const authorized = [config.clientId, config.clientSecret, config.refreshToken, config.calendarId].every(value => typeof value === 'string' && value.length > 0 && value.length <= 4096);
  const rules = calendarRules(env);
  return { credentialsConfigured: authorized, configured: Boolean(authorized && rules), rules };
}
const formatters = new Map();
export function localParts(timestamp, timeZone) {
  if (!formatters.has(timeZone)) {
    if (formatters.size >= 20) formatters.delete(formatters.keys().next().value);
    formatters.set(timeZone, new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }));
  }
  const parts = Object.fromEntries(formatters.get(timeZone).formatToParts(timestamp).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}
function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
const timeMinutes = value => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
export function slotPermitted(start, end, rules, now = Date.now()) {
  if (!Number.isFinite(start) || end - start !== rules.durationMinutes * minute || start < now + rules.noticeHours * 3600000 || start > now + rules.horizonDays * 86400000 || start % minute !== 0) return false;
  const first = localParts(start, rules.timeZone);
  const last = localParts(end, rules.timeZone);
  const weekday = new Date(`${first.date}T12:00:00Z`).getUTCDay();
  const opening = timeMinutes(rules.startTime);
  // A fixed owner-time grid prevents different visitors choosing overlapping slots.
  const step = rules.durationMinutes + rules.bufferMinutes;
  return first.date === last.date && last.minutes - first.minutes === rules.durationMinutes && rules.weekdays.includes(weekday) && first.minutes >= opening && last.minutes <= timeMinutes(rules.endTime) && (first.minutes - opening) % step === 0;
}
async function jsonResponse(response) {
  const reader = response.body?.getReader();
  if (!reader) throw new CalendarError('Google Calendar returned an unreadable response.');
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 1000000) { await reader.cancel(); throw new CalendarError('Google Calendar returned too much data.'); }
    chunks.push(value);
  }
  const buffer = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { buffer.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(buffer)); } catch { throw new CalendarError('Google Calendar returned an unreadable response.'); }
}
export async function googleClient(env, fetcher = fetch) {
  const config = credentials(env);
  if (!googleCalendarStatus(env).configured) throw new CalendarError('Google Calendar is not connected with approved meeting hours yet. Use the meeting request draft.');
  const signal = AbortSignal.timeout(14000);
  let response;
  try {
    response = await fetcher('https://oauth2.googleapis.com/token', {
      method: 'POST', signal, redirect: 'error', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, refresh_token: config.refreshToken, grant_type: 'refresh_token' }).toString(),
    });
  } catch { throw new CalendarError('Google Calendar could not be reached. Please try again.'); }
  if (!response.ok) { await response.body?.cancel(); throw new CalendarError('Google Calendar needs to be reconnected by Bharadwaj.'); }
  const token = await jsonResponse(response);
  if (typeof token.access_token !== 'string' || !token.access_token) throw new CalendarError('Google Calendar needs to be reconnected by Bharadwaj.');
  return {
    calendarId: config.calendarId,
    async request(path, { method = 'GET', body, allowMissing = false, allowConflict = false } = {}) {
      let result;
      try {
        result = await fetcher(`${API}${path}`, { method, signal, redirect: 'error', headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
      } catch { throw new CalendarError('Google Calendar could not confirm the request. Please retry the same request.'); }
      if ((allowMissing && result.status === 404) || (allowConflict && result.status === 409)) { await result.body?.cancel(); return null; }
      if (!result.ok) { await result.body?.cancel(); throw new CalendarError(result.status === 429 ? 'Calendar requests are busy. Please try again shortly.' : 'Google Calendar could not complete the request.', result.status === 429 ? 429 : 503); }
      return jsonResponse(result);
    },
  };
}
export async function busyIntervals(client, start, end) {
  const result = await client.request('/freeBusy', { method: 'POST', body: { timeMin: new Date(start).toISOString(), timeMax: new Date(end).toISOString(), items: [{ id: client.calendarId }], calendarExpansionMax: 1 } });
  const calendar = result.calendars?.[client.calendarId];
  if (!calendar || calendar.errors?.length || !Array.isArray(calendar.busy)) throw new CalendarError('Calendar availability could not be verified. Please try again later.');
  return calendar.busy.map(item => {
    const start = Date.parse(item.start), end = Date.parse(item.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new CalendarError('Calendar availability could not be verified. Please try again later.');
    return { start, end };
  });
}
export const isFree = (start, end, busy, buffer) => busy.every(item => end + buffer <= item.start || start - buffer >= item.end);
export async function findMeetingTimes({ startDate = '', endDate = '', timezone }, env, fetcher = fetch, now = Date.now()) {
  const status = googleCalendarStatus(env);
  if (!status.configured) return { status: 'not_connected', slots: [], note: 'Calendar authorization and approved meeting hours are required. Offer a meeting request draft instead.' };
  if (!validTimeZone(timezone) || (startDate && !validDate(startDate)) || (endDate && !validDate(endDate)) || (startDate && endDate && endDate < startDate)) throw new CalendarError('Use a valid IANA time zone and dates in YYYY-MM-DD format.', 400);
  const rules = status.rules;
  const firstDate = startDate || localParts(now + rules.noticeHours * 3600000, timezone).date;
  const lastDate = endDate || new Date(Date.parse(`${firstDate}T00:00:00Z`) + 6 * 86400000).toISOString().slice(0, 10);
  if (lastDate < firstDate || Date.parse(lastDate) - Date.parse(firstDate) > 14 * 86400000) throw new CalendarError('Search a date range of at most 15 days.', 400);
  const start = Math.max(now + rules.noticeHours * 3600000, Date.parse(`${firstDate}T00:00:00Z`) - 14 * 3600000);
  const end = Math.min(now + rules.horizonDays * 86400000, Date.parse(`${lastDate}T00:00:00Z`) + 38 * 3600000);
  if (end <= start) return { status: 'no_slots', slots: [], note: 'The requested dates are outside the booking window.', rules };
  const client = await googleClient(env, fetcher);
  const buffer = rules.bufferMinutes * minute;
  const busy = await busyIntervals(client, start - buffer, end + buffer);
  const slots = [];
  for (let time = Math.ceil(start / minute) * minute; time + rules.durationMinutes * minute <= end; time += minute) {
    const finish = time + rules.durationMinutes * minute;
    const date = localParts(time, timezone).date;
    if (date < firstDate || date > lastDate || !slotPermitted(time, finish, rules, now) || !isFree(time, finish, busy, buffer)) continue;
    slots.push({ start: new Date(time).toISOString(), end: new Date(finish).toISOString(), timezone, label: new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(time) });
    if (slots.length === 5) break;
  }
  return { status: slots.length ? 'available' : 'no_slots', checkedAt: new Date(now).toISOString(), slots, rules, note: 'These times were free when checked. A suggested time is not a reservation.' };
}
