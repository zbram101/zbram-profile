# Bharadwaj’s portfolio

A responsive React + Vite portfolio with a section-aware Three.js character and a server-side portfolio assistant.

## Local development

Use Node.js 20+ and run `npm install`, then `npm run dev`.

## Publishing blog posts

The blog is available at `/blog/` on the portfolio domain. Add a new entry to `src/blog.js`, create `blog/<slug>/index.html` with the matching `data-post` value, and register the HTML entry in `vite.config.js` before deploying. Each post needs a title, excerpt, date, read-time estimate, tags, hero image, and content sections; the existing articles are copyable examples. Sections support paragraphs, labeled bullet points, comparison tables, diagrams, and callouts.

The assistant works as a clearly labeled profile guide without a key. For AI conversation, copy `.env.example` to `.env.local`, set `OPENAI_API_KEY`, and restart the development server. Run `npm run agent:register` to create/reuse a saved OpenAI portfolio agent and save `OPENAI_AGENT_ID` locally. New sessions inherit that agent's portal configuration; `OPENAI_AGENT_MODEL` controls registration and the inline fallback, defaulting to `gpt-6-astra`. The key must have Agents API permissions and access to the selected model. `OPENAI_MODEL` remains the setting for the legacy Responses fallback. Never prefix a key with `VITE_`; that would expose it to visitors.

The upgraded assistant uses hosted OpenAI Agents API sessions, approved portfolio tools, source cards, and meeting-request preparation. Credentials stay on the server. Hosted conversations are stored by OpenAI; Start over deletes the current session. A booking URL can be configured to let visitors choose availability and confirm on your booking page. Direct calendar booking and message delivery are not yet connected. See [agent setup and meeting coordination](docs/portfolio-agent.md) for configuration, data lifecycle, and deployment requirements.

Official API documentation: https://developers.openai.com/api/docs/quickstart

## Validation and deployment

- `npm test` checks the generated AWS bundle, agent/tool sessions, meeting drafts, request limits, input validation, and API error handling using mock services.
- `npm run build` produces browser assets in `dist` and the Cloudflare Worker in `dist/server/index.js`.
- `npm run build:static` produces only public browser assets. The Amplify build uses this command through `amplify.yml`; server bundles and hosting metadata are excluded.
- `npm run preview` previews the built client using the chat URL selected at build time. Use `npm run dev` to test the local `/api/chat` handler.
- For the Cloudflare Worker, build with `VITE_CHAT_API_URL=/api/chat` and provide the static asset binding `ASSETS`. Deploy the Worker with its assets; static hosting alone cannot run AI chat.
- Set `OPENAI_API_KEY` as a private runtime secret on the hosting provider to activate AI conversation. Local environment files are intentionally excluded from version control and deployments.
- The production frontend defaults to the existing AWS chat endpoint. Deploy its CloudFormation template alongside the Amplify frontend; `VITE_CHAT_API_URL` can override the public endpoint URL. The API key belongs exclusively in the endpoint’s private runtime configuration.
- Before opening to unrestricted public traffic, configure provider usage limits and edge rate limiting appropriate to the audience.

The character keeps the original skeleton and uses custom appearance textures based on Bharadwaj’s reference photo, with a matching illustrated fallback portrait. Asset paths and generation prompts are recorded in `docs/avatar-assets.md`.

The portrait card opens in Portrait mode and offers Wave, Head nod, Portrait, and Work. Reset returns to Portrait mode. Wave and Head nod play once and blend back to a calm standing pose. Portrait shows the illustrated image, with playback and rotation controls hidden, and pauses the 3D scene while keeping it ready for the next gesture. Work returns to the seated typing animation. Section-aware thinking, explaining, and typing poses remain available through the page context; an explicitly selected Portrait mode remains visible while scrolling. There are no dance routines, movement prompts, or model calls for character controls. Reduced-motion preferences start with playback paused. The layout and portrait remain usable if 3D assets or WebGL fail. `npm test` checks the real rig for gesture bounds and workstation fit.

Work history reflects the latest manager résumé supplied in September 2026, including Thermo Fisher Scientific from November 2023 to present. Both Thermo titles share the date range provided in the résumé; separate promotion dates are not listed.

`src/profile.js` is the source for website and assistant facts. After updating it, run `npm run sync:profile` to rebuild the shared agent code and portfolio facts in the AWS chat template. `npm test` checks that the deployed profile definition stays synchronized. Deploy the updated `infrastructure/portfolio-chat.yml` alongside the Amplify website when profile facts change.
