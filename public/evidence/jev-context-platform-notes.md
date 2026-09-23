# Jev in Context Platform: evidence notes

Prepared September 22, 2026 from the Context Platform implementation and saved evaluation reports. No provider calls were made to prepare this article. The accompanying [evaluation JSON](./jev-context-platform-evals.json) contains selected fields from the original reports, joined to the synthetic input descriptions and expected labels.

## What the numbers describe

- The live runs were recorded on September 20, 2026 UTC (September 19 in America/Los_Angeles).
- Adapter: `jev-choice-v1`. Final prompt: `process-bindings-v4`.
- Requested model: `jev-latest`. Returned model in all recorded runs: `jev-1.13.0`.
- The final four reports contain 58 decisions: 37 expected selections or intentional omissions and 21 expected clarifications. All match their labels after applying the 0.5 confidence floor.
- The earlier holdout was inspected during prompt development. Its final rerun is regression evidence. The implementation record states that the final 12-case holdout was created after v4 was fixed.
- The workflow corpus contains independent stage decisions with fixture-supplied confirmed selections. It does not measure a cascading end-to-end workflow or error propagation between model calls.
- `exact_binding_accuracy` excludes expected clarification cases but includes legitimate `no_binding` cases (represented by `null`). `required_correction_rate` counts label disagreements; it is not observed user behavior. `observed_author_correction_rate` remains null.
- p95 uses nearest rank: `sorted(latencies)[ceil(n * 0.95) - 1]`. For 12 cases it is the maximum. These are provider adapter request measurements, not full application or human interaction times.
- Final-run cost totals $0.001467606, calculated from recorded provider input usage at $0.042 per million input tokens and zero output-token charges. Earlier experiments and all other operating costs are excluded.
- These small synthetic sets do not establish production accuracy, broad injection resistance, a service-level objective, or comparative superiority over another model.

## Retained failures

| Run | Case | Expected | Observed final decision | Confidence | Outcome |
| --- | --- | --- | --- | ---: | --- |
| v1 baseline | support-incompatible | needs_clarification | no_binding / null | 0.82 | 21/22 overall; failed the zero-inappropriate-choice gate |
| v3 earlier holdout | support-resolution-fresh | average_resolution_hours | needs_clarification | 0.49 | 11/12 overall; 6/7 exact selections, below the 90% gate |

The first description explicitly requested sales-channel grouping for support tickets, where that dimension was unavailable. The second requested mean elapsed resolution time in hours. The final prompt distinguishes optional absence from unsupported requests, isolates each binding decision, and explicitly supports equivalent metric meanings. The confidence floor remained 0.5.

## Implementation source map

These paths refer to the source Context Platform project. This evidence packet includes no credentials, infrastructure identifiers, customer rows, private profile assertions, or conversation records.

| Topic | Project source |
| --- | --- |
| Choice request, response validation, bounds, and no automatic retries | `app/jev_client.py` |
| Staged candidates, prompt v4, proposal validation and explicit acceptance | `app/process_assist.py` |
| Process candidate eligibility | `app/process_candidates.py` |
| Independent review and publication | `app/process_governance.py`, `app/process_registry.py` |
| Evaluation math and independently supplied stage context | `scripts/evaluate_process_assist.py` |
| Preset acceptance gates | `config/evaluation/jev-process-gates.json` |
| Original labels | `config/evaluation/jev-process-cases.json`, `jev-process-holdout.json`, `jev-process-workflow.json`, `jev-process-final-holdout.json` in that directory |
| Saved live reports | Six `docs/jev-evaluation*.json` reports named in the accompanying JSON |
| Provider contract tests | `tests/test_jev_client.py` |
| Proposal races, stale/tampered/foreign proposals, acceptance and failure behavior | `tests/test_process_assist_graph.py` |
| Milestone verification and local author/reviewer/publisher walkthrough | `docs/process-m2-m3-progress.md`, `docs/process-authoring.md` |
| New local chat field suggestion implementation | `app/chat_field_assist.py`, `app/field_search.py`, `web/src/ChatComposer.tsx` |
| New local field suggestion tests | `tests/test_chat_field_assist.py`, `web/src/chat-field-suggestions.test.mjs` |

## Validation and deployment scope

The M2/M3 completion record reports 326 Python tests passing, seven separately gated live API tests skipped, eight Node tests passing, and a successful web production build. It also records a local browser walkthrough that saved an unresolved process, accepted four Jev suggestions, completed independent review, and published version 1.0.0. These are historical implementation results, not tests rerun for the blog.

The deployment record reports successful preflight and postflight checks and unchanged results for 14 existing metrics. Jev-assisted authoring and reviewed publication were enabled for the sales pilot. Owned process runs and the integrated pilot remained pending.

As inspected on September 22, chat field assistance is newer local work outside that committed milestone. The process-binding evaluation does not evaluate chat search coverage, ranking, or recommendation quality. Local tests exercise scope, pagination, inactive-field exclusion, supplied-candidate recommendation, and transaction boundaries.

## External references

- [TypeSafe introduction](https://docs.typesafe.ai/introduction): independent typed questions evaluated against a supplied state.
- [Choice API contract](https://docs.typesafe.ai/api): request and response structure.
- [Confidence](https://docs.typesafe.ai/confidence): distribution-derived confidence and application-specific thresholds.
- [Models](https://docs.typesafe.ai/models): Jev 1.13 pricing and the difference between aliases and returned version identifiers; checked September 22, 2026.
