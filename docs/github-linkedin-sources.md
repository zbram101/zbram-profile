# GitHub and LinkedIn sources

## Public GitHub tools

The agent exposes `search_github_repositories` and `get_github_repository`. Both run in `server/github.js` and only read repositories owned by the username in the approved portfolio GitHub URL, currently `zbram101`.

Search reads up to three pages of public repository metadata, filters names/descriptions/languages/topics locally, and returns up to five matches. Detail lookup reads metadata and the preferred README. README text is capped at 12,000 characters. Repositories without a readable README still return metadata. Forks are labeled; repository presence does not establish authorship, project completion, deployment, or professional credentials.

Requests use GitHub's REST API with no Authorization header. A GitHub credential in the environment cannot turn this into a private-repository reader. Paths and destinations are fixed; the tools do not follow README links, redirect to other hosts, read arbitrary files, access issues, or execute repository instructions. The model receives README content as untrusted source data.

Each lookup has an eight-second deadline; JSON response bodies are capped at one megabyte. A bounded per-instance cache coalesces concurrent requests and retains successful results for 60 seconds. This can briefly reflect recently changed public data. GitHub rate limits still apply, particularly across multiple application instances. Errors are reported without upstream debug details. No content is silently substituted after failures.

GitHub works in both the hosted agent and the no-key Portfolio guide. The previous `CHAT_BACKEND=responses` rollback does not expose agent function tools.

## Private GitHub review

The owner's Codex GitHub connection is separate from the deployed website. The owner approved repository-name and README review in this task, but public use of private details needs a separate decision. Draft review material must stay outside this repository, the browser bundle, the generated Lambda template, and deployment output.

Only exact owner-approved public summaries belong in `approvedPrivateProjectSummaries` in `server/approved-sources.js`. Each entry follows the portfolio record shape: `id`, `title`, `kind`, a public `url`, `summary`, and `details`. Use a public project URL or portfolio section, not the private repository URL. Record the approved description, not raw code, infrastructure settings, credentials, or internal documentation. The array remains empty until publication approval arrives. Visitor messages and function arguments cannot alter it.

No new private-repository OAuth grant or website token is required for this approach. If a separate private application later needs repository access, use selected-repository read access. GitHub's README API documents Contents: read permissions for supported fine-grained tokens and GitHub App tokens. Do not give such credentials to this anonymous public chatbot.

## LinkedIn

The verified profile URL is https://www.linkedin.com/in/bharadwaj-ramachandran-51bb32a3/.

The full profile was not retrievable in this task: the browser returned a sign-in wall and the public fetch failed. No LinkedIn content has been inferred from the portfolio or search snippets. `get_linkedin_profile` therefore returns `status: import_pending`, a null text value, and the verified profile link.

To complete the import, obtain the owner's supplied About and Experience text or profile export, confirm the text is intended for public chatbot use, then set `linkedinSnapshot` in `server/approved-sources.js` to `{ text, importedAt }`. Keep only the profile sections needed for professional answers. The tool labels it an imported snapshot and returns its date; it must never claim automatic updates or live LinkedIn access.

A live LinkedIn integration would need its own authorized API application and appropriate permissions. A public profile URL alone is not a full-profile API credential. The current integration does not read connections, messages, feeds, or recruiter data.

## Validation and deployment

Run `npm run sync:profile`, `npm test`, and `npm run build` after changing server tools or approved content. The generated AWS handler includes the same modules as local development. The production backend includes these tools; only the empty approved-private-summary catalog and the explicit pending LinkedIn snapshot are deployed.

References:

- [GitHub repository README API](https://docs.github.com/en/rest/repos/contents#get-a-repository-readme)
- [GitHub token permissions and repository selection](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [LinkedIn API access and permissions](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access)
- [OpenAI agent function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions)
