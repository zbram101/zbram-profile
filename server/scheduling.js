import { profile } from '../src/profile.js';
import { googleCalendarStatus } from './google-calendar.js';

export function schedulingOptions(env = {}) {
  let bookingUrl = null;
  try {
    const url = new URL(env.BOOKING_URL);
    if (url.protocol === 'https:' && !url.username && !url.password) bookingUrl = url.href;
  } catch { /* No booking page configured. */ }
  const calendar = googleCalendarStatus(env);
  return {
    mode: calendar.configured ? 'google_calendar' : bookingUrl ? 'booking_link' : 'contact',
    bookingUrl,
    contactUrl: profile.linkedin,
    details: typeof env.MEETING_DETAILS === 'string' ? env.MEETING_DETAILS.slice(0, 1200) : '',
    canReadAvailability: calendar.configured,
    canBook: false,
    calendarRules: calendar.rules,
    currentTime: new Date().toISOString(),
    note: calendar.configured ? 'Use find_meeting_times to check Google Calendar. Only available slots are shared; suggested times are not reserved. Prepare a request for Bharadwaj to confirm.' : bookingUrl ? 'Choose a time and confirm on the booking page. Opening the page does not book a meeting.' : 'Prepare a message and send it to Bharadwaj on LinkedIn. Times need his confirmation.',
  };
}

export function meetingDraft({ topic, name = '', timezone = '', preferredTimes = '' }, env = {}) {
  if (typeof topic !== 'string' || !topic.trim()) throw new Error('Please describe what you would like to discuss.');
  const draft = [
    'Hi Bharadwaj,',
    name.trim() ? `I’m ${name.trim()}. I’d like to discuss ${topic.trim()}.` : `I’d like to discuss ${topic.trim()}.`,
    timezone.trim() ? `My time zone: ${timezone.trim()}.` : '',
    preferredTimes.trim() ? `Times that work for me (subject to your availability): ${preferredTimes.trim()}.` : '',
    'Would you be open to a conversation? Please let me know a time that works for you.',
  ].filter(Boolean).join('\n\n');
  return { cards: [{ type: 'meeting', id: 'meeting-draft', title: 'Your meeting request', draft, scheduling: schedulingOptions(env) }] };
}
