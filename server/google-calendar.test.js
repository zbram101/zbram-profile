import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendarRules, findMeetingTimes, googleCalendarStatus, slotPermitted } from './google-calendar.js';
import { schedulingOptions } from './scheduling.js';
import { executePortfolioTool } from './portfolio-tools.js';

const rules = { timeZone: 'America/Los_Angeles', durationMinutes: 30, weekdays: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00', noticeHours: 24, bufferMinutes: 15, horizonDays: 21 };
const env = { GOOGLE_CLIENT_ID: 'client-test', GOOGLE_CLIENT_SECRET: 'secret-test', GOOGLE_REFRESH_TOKEN: 'refresh-test', GOOGLE_CALENDAR_RULES: JSON.stringify(rules) };
const now = Date.parse('2026-09-13T16:00:00Z');
function google({ busy = [], calendarError = false, tokenError = false } = {}) {
  const calls = [];
  return { calls, fetcher: async (url, options) => {
    calls.push({ url, options });
    if (url === 'https://oauth2.googleapis.com/token') {
      assert.equal(new URLSearchParams(options.body).get('refresh_token'), 'refresh-test');
      return Response.json(tokenError ? { error: 'invalid_grant', secret: 'private-provider-detail' } : { access_token: 'access-test' }, { status: tokenError ? 400 : 200 });
    }
    assert.equal(url, 'https://www.googleapis.com/calendar/v3/freeBusy');
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, 'Bearer access-test');
    assert.deepEqual(JSON.parse(options.body).items, [{ id: 'primary' }]);
    return Response.json({ calendars: { primary: { busy, ...(calendarError ? { errors: [{ reason: 'notFound' }] } : {}) } }, privateTitle: 'Do not expose any provider extras' });
  } };
}

test('Calendar remains disabled until credentials and approved scheduling rules exist', async () => {
  assert.equal(googleCalendarStatus({}).configured, false);
  assert.equal(googleCalendarStatus({ GOOGLE_CALENDAR_SECRET: 'null' }).configured, false);
  assert.equal(googleCalendarStatus({ GOOGLE_CALENDAR_SECRET: '[]' }).configured, false);
  assert.equal(googleCalendarStatus({ ...env, GOOGLE_CLIENT_ID: {} }).configured, false);
  assert.equal(googleCalendarStatus({ ...env, GOOGLE_CALENDAR_RULES: '' }).configured, false);
  assert.equal(schedulingOptions(env).canReadAvailability, true);
  assert.equal(schedulingOptions(env).canBook, false);
  for (const invalid of [{ ...rules, weekdays: [8] }, { ...rules, durationMinutes: 0 }, { ...rules, timeZone: 'invented' }, { ...rules, startTime: '18:00' }, { ...rules, noticeHours: 0 }, { ...rules, extra: 'field' }]) {
    assert.equal(calendarRules({ GOOGLE_CALENDAR_RULES: JSON.stringify(invalid) }), null);
  }
  const data = await findMeetingTimes({ timezone: 'America/Los_Angeles' }, {}, () => { throw new Error('Network must not run'); }, now);
  assert.equal(data.status, 'not_connected');
});

test('available times exclude busy periods and buffers, and expose no calendar details', async () => {
  const { fetcher, calls } = google({ busy: [{ start: '2026-09-14T16:00:00Z', end: '2026-09-14T17:00:00Z' }] });
  const data = await findMeetingTimes({ startDate: '2026-09-14', endDate: '2026-09-14', timezone: 'America/Los_Angeles' }, env, fetcher, now);
  assert.equal(data.status, 'available');
  assert.equal(data.slots.length, 5);
  assert.equal(data.slots[0].start, '2026-09-14T17:30:00.000Z');
  assert.ok(data.slots.every(slot => slotPermitted(Date.parse(slot.start), Date.parse(slot.end), rules, now)));
  assert.doesNotMatch(JSON.stringify(data), /access-test|refresh-test|secret-test|primary|privateTitle|Do not expose/);
  assert.equal(calls.length, 2);
});

test('all-day conflicts produce no slots and upstream errors never imply availability', async () => {
  const { fetcher } = google({ busy: [{ start: '2026-09-14T00:00:00Z', end: '2026-09-16T00:00:00Z' }] });
  assert.equal((await findMeetingTimes({ startDate: '2026-09-14', endDate: '2026-09-14', timezone: 'America/Los_Angeles' }, env, fetcher, now)).status, 'no_slots');
  for (const config of [{ calendarError: true }, { tokenError: true }]) {
    await assert.rejects(findMeetingTimes({ timezone: 'America/Los_Angeles' }, env, google(config).fetcher, now), error => !/private-provider-detail|secret-test/.test(error.message));
  }
});

test('Calendar handles daylight saving transitions and visitor dates in another time zone', async () => {
  const beforeChange = Date.parse('2026-10-31T12:00:00Z');
  const sunday = { ...env, GOOGLE_CALENDAR_RULES: JSON.stringify({ ...rules, weekdays: [0, 1], noticeHours: 1 }) };
  const data = await findMeetingTimes({ startDate: '2026-11-01', endDate: '2026-11-01', timezone: 'America/New_York' }, sunday, google().fetcher, beforeChange);
  assert.equal(data.slots[0].start, '2026-11-01T17:00:00.000Z');
  assert.match(data.slots[0].label, /12:00/);
  const tokyo = await findMeetingTimes({ startDate: '2026-09-15', endDate: '2026-09-15', timezone: 'Asia/Tokyo' }, env, google().fetcher, now);
  assert.equal(tokyo.slots[0].start, '2026-09-14T16:00:00.000Z');
});

test('Calendar rejects malformed dates, oversized searches, and model-supplied calendar IDs', async () => {
  const noNetwork = () => { throw new Error('Unexpected network'); };
  for (const args of [{ timezone: 'GMT nonsense' }, { timezone: 'UTC', startDate: '2026-02-30' }, { timezone: 'UTC', startDate: '2026-09-14', endDate: '2026-12-30' }]) {
    await assert.rejects(findMeetingTimes(args, env, noNetwork, now));
  }
  assert.throws(() => executePortfolioTool('find_meeting_times', { startDate: '', endDate: '', timezone: 'UTC', calendarId: 'other@example.test' }, env, noNetwork));
});
