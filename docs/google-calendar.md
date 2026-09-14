# Google Calendar connection

The website now has a `find_meeting_times` agent tool. It reads free/busy data from the owner's configured Google Calendar and offers times in the visitor's time zone, entirely through chat. It does not request event titles, descriptions, attendees, or Gmail messages. It cannot yet create events or send invitations; the owner's booking preference is pending.

**Current status:** Google Calendar is authorized and verified for local development. The owner-approved Google Cloud project **Portfolio Calendar** (`zbram-portfolio-calendar`) is created, its Calendar API is enabled, and its OAuth app is registered under the same name with an External testing audience. The owner approved Google's terms, credential creation, adding their account as the only test user, and the meeting hours below, then completed Google consent. Client credentials and the refresh token are stored in ignored `.env.local` with owner-only file permissions. A real saved-agent conversation called `get_scheduling_options` and `find_meeting_times`, checked the owner's primary calendar, and returned available times. Its temporary OpenAI session was deleted. The website/AWS changes have not been deployed; Google OAuth remains in Testing. Gmail connected to Codex is separate from this website connection.

## Owner setup

1. Select an approved Google Cloud project and enable the Google Calendar API.
2. Configure Google Auth Platform branding and audience. For testing, add your Google account as a test user.
3. Create an OAuth client of type **Web application** for this portfolio. Register this exact authorized redirect URI:

   ```text
   http://127.0.0.1:53682/oauth2/callback
   ```

4. Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_OWNER_EMAIL` in `.env.local`. The detected owner's email has already been filled in locally; it is not in the repository. Never use a `VITE_` prefix for these values.
5. Run `npm run calendar:connect` and open the Google authorization URL it prints. The owner chooses the account and approves free/busy access and account email verification. The utility verifies the returned account matches `GOOGLE_OWNER_EMAIL`, then saves the refresh token directly into the ignored `.env.local`, without printing it.
6. Set `GOOGLE_CALENDAR_RULES` to the owner's approved rules. Until both the credentials and valid rules exist, the tool returns `not_connected` and the chat keeps its meeting-draft flow.

The setup utility listens only on loopback, validates a single-use OAuth state, uses PKCE, expires after 10 minutes, and never ships with the website. Google may issue seven-day refresh tokens for an external OAuth app in Testing; configure the appropriate production consent status before relying on unattended availability checks.

## Scheduling rules

The owner approved the following rules, now active locally through `GOOGLE_CALENDAR_RULES`:

```json
{"timeZone":"America/Los_Angeles","durationMinutes":30,"weekdays":[1,2,3,4,5],"startTime":"09:00","endTime":"17:00","noticeHours":24,"bufferMinutes":15,"horizonDays":21}
```

Weekdays use Sunday=0 through Saturday=6. Only one same-day opening interval is supported; overnight windows are rejected. The tool searches at most 15 visitor-local dates per call and returns at most five free slots. The agent offers up to three at a time. The scheduling grid uses the owner's local time and accounts for daylight saving changes. Every lookup obtains fresh Google availability, includes buffers on either side of a busy interval, and treats missing calendars or API errors as unavailable rather than free.

The default target is `primary`. An explicit `GOOGLE_CALENDAR_ID` can select another owner-approved calendar. Only that calendar's busy intervals are checked; if you keep other commitments in separate calendars, those are not automatically included.

## Production on AWS

The existing CloudFormation template supports two optional parameters:

- `GoogleCalendarSecretName`: the name of an existing Secrets Manager secret containing `clientId`, `clientSecret`, `refreshToken`, and `calendarId` as JSON.
- `GoogleCalendarRules`: the approved rules JSON above.

The template resolves the secret into the Lambda environment through a Secrets Manager dynamic reference. Neither the secret nor tokens belong in stack parameters, frontend assets, logs, or this documentation. The Lambda handler passes this configuration to the same calendar module used locally. No Google secret or AWS stack update has been performed yet. Deploy the generated template through S3 because its size exceeds CloudFormation's inline template limit.

## Tests and boundaries

`server/google-calendar.test.js` checks missing configuration, invalid rules, busy intervals, buffers, all-day conflicts, daylight saving changes, visitor-local dates, malformed requests, and privacy filtering. These use mock Google responses. The opt-in `node scripts/test-live-agent.mjs --calendar-only` additionally passed a real Google-authorized free/busy request through the saved OpenAI agent and website handler. It verified the returned data shape excludes private event details and deleted its temporary conversation afterward.

Event creation remains disabled. If the owner opts into bookings after visitor confirmation, add a separately confirmed booking action, retry deduplication, a fresh availability check, and a durable reservation record. A calendar proposal or draft must never be described as a booked meeting.

References: [Google free/busy API](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query), [web server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [Calendar scopes](https://developers.google.com/workspace/calendar/api/auth), [OAuth refresh-token expiration](https://developers.google.com/identity/protocols/oauth2#expiration).
