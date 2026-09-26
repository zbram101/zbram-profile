# Portfolio agent and meeting coordination

The React widget uses the hosted OpenAI Agents API. `server/agent.js` calls its HTTP endpoints with `OpenAI-Beta: agents=v1`; it does not require the separate Agents SDK. Every visitor conversation gets its own session, with a signed bearer token kept in that tab’s React memory. No OpenAI credentials are exposed to the browser.

## Available workflows

- Search approved experience, projects, skills, and writing, then show source cards.
- Compare a pasted role description (up to 8,000 characters) against documented evidence and identify gaps.
- Offer navigation to a known portfolio section.
- Read public zbram101 GitHub repository metadata and READMEs with source cards and fork attribution.
- Read an owner-supplied LinkedIn snapshot once imported; currently the tool returns an explicit pending status.
- Check the owner's primary Google Calendar free/busy within approved meeting hours; authorized and live-tested through the production AWS API.
- Read the owner’s scheduling configuration and prepare a meeting introduction in the conversation.
- Open a configured booking page where a visitor can choose availability and complete the booking.

Meeting coordination stays in the chat: the assistant asks one question at a time, uses details already supplied, and prepares a readable draft. Changes are requested through the same chat input. The visitor copies and sends the draft through the verified LinkedIn profile. With no OpenAI key, a small guided conversation supports topic, time zone, preferred times, cancellation, and revising draft fields; this fallback is labeled Portfolio guide and does not infer details like the AI agent. Its draft context is held in React memory and validated on the server. Meeting details supplied in an AI conversation are processed by OpenAI like other chat content.

## What is needed for live scheduling

Google Calendar availability is authorized and live-tested in production; see [connection status and production setup](./google-calendar.md). Approved rules are 30 minutes, Monday–Friday 9 am–5 pm America/Los_Angeles, 24 hours' notice, 15-minute buffers, and a 21-day horizon. A public booking URL remains supported as a fallback. The owner has not selected automatic event creation, which remains disabled. Do not paste calendar tokens into the chat or repository.

Set `BOOKING_URL` to an HTTPS scheduling page and `MEETING_DETAILS` to the approved rules. In AWS these are the `BookingUrl` and `MeetingDetails` stack parameters. Leave both blank until the owner provides them. The assistant never treats preferred times or a link click as a booking.

Google Calendar free/busy lookup is implemented behind owner credentials and approved rules. Event creation is not implemented; it still requires conflict rechecking, a confirmed booking action with idempotency, and a returned reservation ID before claiming success. The current tool registry deliberately contains no send or booking function. Do not attach the owner’s general mailbox or private calendar to this public agent.

## OpenAI setup

The reusable [Bharadwaj Portfolio Agent](https://platform.openai.com/agents/agent_2277fc669dce41c1a15c5692602ad6e328e652398384480e9b?project_id=proj_2qUBy2K0BahF9SIkNij1L84a) is created in the existing **Therapy AI / Default project** and verified in the portal. It has the portfolio instructions, all nine function definitions, GPT-6 Astra, low verbosity, and multi-agent execution disabled. Local `.env.local` and the production AWS `SavedAgentId` parameter both select this agent. New conversations inherit the saved agent's configuration without inline overrides, so portal edits apply to new sessions. Function execution and argument validation still run in this application's server; Google credentials are not stored in the OpenAI agent.

`npm run agent:register` creates or reuses the portfolio agent and saves its ID locally. It leaves existing portal configuration unchanged. To deliberately replace the saved prompt/model/tools with the current source configuration, run `npm run agent:register -- --update`. Without `OPENAI_AGENT_ID`, the server retains its inline configuration fallback. For AWS, set the `SavedAgentId` stack parameter to this ID and use a key from the same OpenAI project. The production stack now selects this saved ID and reuses the existing `OAIprofile` secret.

Set the `OpenAISecretName` stack parameter to a server-only Secrets Manager secret containing a key from the saved agent's project. Its default remains `OAIprofile` for existing deployments. The production release reuses the existing `OAIprofile` secret; it does not copy or replace the local OpenAI key. The application key needs `api.agents.read`, `api.agents.write`, and `api.responses.write`. Local development reads `OPENAI_API_KEY` from `.env` or `.env.local`. The owner-provided local key successfully ran hosted agent sessions on September 13, 2026. Keep secrets server-side. `OPENAI_AGENT_MODEL` defaults to `gpt-6-astra`; the previous Responses chat uses its separate `OPENAI_MODEL` setting.

`CHAT_BACKEND=responses` is an operational rollback for the UI. It switches the widget back to its earlier chat protocol. With no key, the widget remains a labeled profile guide with guided meeting coordination in the conversation. This is a configuration check, not a successful provider connectivity probe.

## Request lifecycle and limits

1. `POST /chat` with `action: create`, `message`, and `requestId` creates the OpenAI session with the first visitor message and returns a signed session token. Conversation-only sessions require this initial input. With `OPENAI_AGENT_ID`, the request passes `agent_id` and omits inline overrides; otherwise it sends the source configuration without `name`, which is unsupported inline. Creation starts model work immediately and is not retried automatically: the live API did not deduplicate repeated create requests. An uncertain create response asks the visitor to start over; an abandoned session may need owner-side cleanup.
2. `action: message` submits subsequent messages with a stable idempotency key. Retries reuse that key. The first message is not submitted a second time after creation.
3. `action: poll` reads session state, the latest turn, and saved items. Pending allowlisted function calls are validated, run on the server, and returned through session events. These tools are local lookups, bounded public GitHub reads, Google Calendar free/busy queries, or drafts. Polling makes progress without holding the API Gateway request open across the whole model turn.
4. Only a completed final answer is rendered as the result. Source cards are reconstructed from successfully completed allowlisted tools, never arbitrary model URLs. GitHub cards use saved tool results and validated canonical repository links so polls do not repeat network reads.
5. Stop cancels a submitted turn. Start over cancels active work, waits for the session to become idle, and deletes the provider session before clearing the widget. The provider rejects deletion while work or required actions remain active. If stopping takes longer than the request deadline, the widget keeps the conversation so deletion can be retried. An already deleted session counts as successful cleanup.

Each server invocation has an 18-second provider deadline. A polled task is cancelled after 120 seconds, more than 12 tool calls, or a reported 60,000 cumulative session tokens. Conversations permit at most 20 turns. OpenAI project spend limits remain necessary because these are application limits, not a guaranteed provider billing ceiling. The AWS adapter uses durable per-minute rate counters (6 creates, 12 messages/drafts, 90 polls, 20 cleanup actions per source IP) plus the existing API Gateway throttles. Counter keys contain a rotating keyed hash, never raw IPs or message content, and expire through DynamoDB TTL.

Polling advances application tools while the visitor stays on the page. After a closed tab, OpenAI may finish its current model step or wait for a tool result; no application function sends a message or books a meeting in the background. A future direct-calendar integration should add durable processing and cleanup rather than depend on browser polling.

## Data lifecycle

Unlike the earlier `store:false` Responses implementation, hosted agent sessions save conversation items with OpenAI. The widget discloses this. Local tokens and messages are held in React memory and are lost on reload; no chat transcript is added to the analytics table or application logs. Tokens expire after 24 hours. Expiring a token or closing a tab does not delete the OpenAI session. Start over explicitly calls the provider DELETE endpoint, including for an expired token. Before enabling this publicly, establish the project’s retention/cleanup policy for abandoned sessions; sessions created here carry `metadata.application=zbram-portfolio` and can be cleaned up through the Agents API. Never describe token expiry as provider deletion.

## Build and release

`server/lambda.js` is the AWS adapter. It preserves the previous visitor analytics and delegates chat to the same handler used in development and the Cloudflare build. `npm run sync:profile` now bundles the complete shared handler, including profile/blog facts, into the CloudFormation `ZipFile` block. Edit source modules rather than the generated block. `npm test` verifies that the generated code matches the source and executes the exact AWS bundle with mocked AWS services.

### Blog analytics

The blog index and article pages send `page_view` and `link_click` events to the existing `POST /event` endpoint. The client reuses the profile's anonymous browser ID, sends one view per document load (including React effect replays), and uses keepalive requests for links followed to another page. Primary, keyboard, and middle-button link activation are covered. Local development and browsers requesting Do Not Track do not send events. If browser storage is unavailable, an in-memory ID keeps the page working, but returning-visitor estimates become less accurate.

The Lambda accepts only published page paths and links found in the article content. It derives article titles and link labels on the server and removes query strings and fragments from destination URLs, except the known `#top` navigation action. Logs contain `EventType`, `Page`, `PageTitle`, optional `ArticleSlug`/`ArticleTitle`, `VisitorHash`, and (for clicks) `LinkLabel`, `LinkTarget`, and `LinkType`. No raw browser ID, IP address, chat text, or arbitrary clicked text is included. Anonymous IDs are hashed, not a claim of identifying individual people.

The existing `bharadwaj-portfolio-chat-analytics` CloudWatch dashboard includes estimated blog visitors, views/readers by article, click destinations by originating page, daily blog trends, and recent activity. Logs Insights calculates distinct hashed browser IDs over the selected range within the existing 14-day log retention; distinct counts can be approximate at high cardinality. The existing `UniqueVisitors` metric remains a daily, site-wide count—summing days is not a distinct audience count for the whole period. Reloads count as views, repeat clicks count as clicks, and bots or blocked analytics affect totals. New blog data starts with this deployment; earlier traffic cannot be reconstructed.

`PortfolioAnalytics` retains the site-wide `PageViews`, `UniqueVisitors`, and `ChatMessages` metrics and adds `BlogViews`, `ArticleViews`, `LinkClicks`, and `BlogLinkClicks`. `PageViews` and `LinkClicks` also have bounded `Site`/`Page` dimensions. Visitor hashes and clicked URLs are log fields only, never metric dimensions. The implementation follows the [CloudWatch embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html).

Run:

```sh
npm run sync:profile
npm test
npm run build
```

Deploy the CloudFormation template and frontend together. The template is now larger than CloudFormation’s 51,200-byte inline request limit, so use an S3-backed template upload (for example the deployment CLI’s `--s3-bucket` support), not a raw inline `--template-body`. The template now targets the supported Node.js 24 Lambda runtime (local tests ran on Node.js 20). The stack adds a small expiring DynamoDB rate-counter table and its scoped UpdateItem permission. Run the normal CloudFormation validation/change-set review before deployment. The AWS backend was updated on September 13, 2026. CloudFormation reviewed the update without replacements or deletions of existing resources.

For Amplify, `amplify.yml` runs `npm ci` and `npm run build:static`, excluding the alternate Worker bundle and hosting metadata. The existing custom domain maps to `codex/modernize-portfolio` in app `dn8ysw76ubukd` (us-west-1). Deploy the backend stack `bharadwaj-portfolio-chat` in us-east-1 before publishing that branch. The local development URL defaults to `/api/chat`. Production retains the existing AWS URL unless `VITE_CHAT_API_URL` overrides it. Both GET and POST are allowed in the AWS CORS configuration. The static frontend alone cannot activate the new agent endpoints.

## Verification and remaining launch checks

The saved-agent integration passes 41 offline tests, a static production build, CloudFormation linting, and the three focused Guard rules in `infrastructure/portfolio.guard`. The deployed AWS API also returned real Google Calendar slots using the approved rules and correctly stated that the slots were not reserved. `node scripts/test-live-agent.mjs --saved-agent-only` passed a real session using the saved ID through the website handler: it executed portfolio lookups and returned a grounded answer with source cards. `--calendar-only` also passed a real scheduling conversation using Google free/busy data and the approved rules. All temporary sessions from these checks, including an interrupted validation attempt, were deleted; the reusable agent remains. A frontend build scan found no OpenAI key, Google client secret, or refresh token in public assets.

Unit and integration tests cover signed ownership, token tampering/expiry, duplicate message retries, tool output handling, bounded execution, missing scheduling configuration, conversational drafts and corrections, AWS CORS/rate limiting, and analytics compatibility. Browser checks exercise meeting coordination through the chat at desktop and mobile widths. Offline provider lifecycle tests use fixtures. A separate opt-in live test (`node scripts/test-live-agent.mjs`) successfully created a real `gpt-6-astra` session, answered a Thermo Fisher RAG question with source cards, read the public `zbram-profile` README, and prepared a meeting draft in conversation. All three temporary API sessions created during validation were deleted. Browser verification also confirmed the widget enters Portfolio agent mode, asks about the meeting topic, accepts the topic and time zone as a chat reply, and renders an unsent draft with Copy message and Open LinkedIn controls. There is no separate scheduling form. This smoke test establishes connectivity and those workflows, not broad model quality. GitHub tests cover owner and public-visibility restrictions, no-credential requests, bounded bodies, README decoding, external-link rejection, caching, and saved-result cards.

Before release, broaden evaluation beyond the successful live smoke test: role comparison with evidence gaps, a follow-up question, scheduling with/without a booking link, unknown availability, requests to fabricate a booking, and a provider failure. Record task success, unsupported claims, latency, and cost. No live calendar action should be introduced without a confirmed provider result.

Official references:

- [Agents API quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart)
- [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions)
- [Function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions)

See [GitHub and LinkedIn sources](./github-linkedin-sources.md) for public access and owner-approved import boundaries.
