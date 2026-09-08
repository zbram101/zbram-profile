# Bharadwaj’s portfolio

A responsive React + Vite portfolio with a section-aware Three.js character and a server-side portfolio assistant.

## Local development

Use Node.js 20+ and run `npm install`, then `npm run dev`.

The assistant works as a clearly labeled profile guide without a key. For AI conversation, copy `.env.example` to `.env.local`, set `OPENAI_API_KEY`, and restart the development server. `OPENAI_MODEL` defaults to `gpt-4.1-mini` and can be changed to a compatible Responses API model available to the account. Never prefix a key with `VITE_`; that would expose it to visitors.

The server calls the OpenAI Responses API with the conversation history and the portfolio facts from `src/profile.js`. Credentials stay on the server. Conversations remain in memory in the browser and the API request uses `store: false`. No email delivery or meeting scheduling is implied by the assistant.

Official API documentation: https://developers.openai.com/api/docs/quickstart

## Validation and deployment

- `npm test` tests profile answers, conversation context, input validation, and API error handling using mock provider responses.
- `npm run build` produces browser assets in `dist` and the Cloudflare Worker in `dist/server/index.js`.
- `npm run preview` previews the built client and the same chat handler locally.
- The Worker expects the static asset binding `ASSETS`; requests to `/api/chat` go to the server handler. Deploy the Worker with its assets; static hosting alone cannot run AI chat.
- Set `OPENAI_API_KEY` as a private runtime secret on the hosting provider to activate AI conversation. Local environment files are intentionally excluded from version control and deployments.
- AWS Amplify static hosting uses the profile guide by default. To use an AI endpoint there, deploy a server-side endpoint separately and set only its public URL as `VITE_CHAT_API_URL`; the API key belongs exclusively in that endpoint's private runtime configuration.
- Before opening to unrestricted public traffic, configure provider usage limits and edge rate limiting appropriate to the audience.

The character uses the original avatar and Wave, Pointing, Typing, and Standing animation assets. Controls allow visitors to try poses or pause motion; reduced-motion preferences start with motion paused. The layout and links remain usable if 3D assets or WebGL fail.

Work history reflects the latest manager résumé supplied in September 2026, including Thermo Fisher Scientific from November 2023 to present. Both Thermo titles share the date range provided in the résumé; separate promotion dates are not listed.

`src/profile.js` is the source for website and assistant facts. After updating it, run `npm run sync:profile` to refresh the AWS chat template. `npm test` checks that the deployed profile definition stays synchronized. Deploy the updated `infrastructure/portfolio-chat.yml` alongside the Amplify website when profile facts change.
