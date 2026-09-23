# Kalshi Pilot: live screening check and later application evidence

Prepared September 23, 2026 UTC (September 22 in America/Los_Angeles). This supplements the [original implementation notes](./jev-kalshi-pilot-notes.md). The three evidence types below answer different questions. No new model inference or trading operation was requested to prepare this follow-up.

## 1. One completed live Jev screening check

The saved development-task command output for `node work/check-research.mjs` records:

```json
{"researchCompleted":true,"sufficientEvidence":false,"sourceCount":0,"usage":{"day":"2026-09-23","openai":0,"jev":1,"input":701,"output":22,"cached":0,"hits":0,"filtered":1},"exchangeWrites":0}
```

This output came from a completed development run, not a mocked test. The inspected script fetches one public baseball contract and calls the application's `Research.analyze`. Its model transport permits POST requests only to the Jev and OpenAI inference endpoints. It does not run the trading engine or call a broker order method. The output's zero-write field agrees with that source path.

The check made one Jev request, recorded one filtered result, and made no OpenAI research request. Because the OpenAI count is zero, the 701 input and 22 output tokens in this check's shared usage totals belong to Jev. These are recorded usage counts, not a price calculation or a measured savings percentage. The script stores counters cumulatively; the captured check shows no cache hits.

This confirms execution of the live rejection branch. It does not establish that rejecting the contract was correct. No human label, raw Noul score, returned model version, or request duration was retained in this output. The configured alias was `jev-latest`, which does not identify an immutable model version.

## 2. Paper-run observations

A later completed development-task report records an inspection with **48 skipped decisions**:

| Recorded reason | Decisions |
| --- | ---: |
| Insufficient evidence | 38 |
| Estimated advantage below the configured 19-percentage-point entry threshold | 10 |

These counts are preserved from the development report; this article did not independently query or publish the account ledger. They describe a snapshot, not the current continuously changing state of the app. Decisions need not represent unique contracts or distinct model calls.

The insufficient-evidence flag can result from Jev filtering, missing rules, later research, or failed source validation. There is no basis for attributing all 38 outcomes to Jev. The ten entry-threshold failures concern application rules applied to research estimates and prices. They do not demonstrate a calibrated forecasting model or profitable strategy. No exchange order or profitability result is inferred from these observations.

## 3. Reproduced application tests

The existing suite was rerun from an isolated temporary copy of seven source/test files. **37/37 tests passed**, with zero failures or skips. The copied files exclude credentials, account state, private keys, and market positions. The tests supply provider and exchange responses; no external provider or exchange operation was made. The config test creates its own temporary fixture file.

- [Complete 37-test TAP output](./jev-kalshi-pilot-followup-tests.tap)
- [Exact source hashes and capture time](./jev-kalshi-pilot-followup-manifest.json)

The Jev/cache test supplies a Noul score of 0.2, calls analysis twice for the same fixture, and verifies one Jev request, one cache hit, and zero OpenAI requests. Other tests retain price-versus-estimate diagnostics, reject unsourced placeholder probabilities, reject unusable market conditions before research, preserve research history and budgets through configuration changes, and handle a zero-fill order without recording a completed trade.

These are implementation checks. They do not validate the 0.8 researchability cutoff or score actual contracts against human labels. In particular, the 37 tests must not be reported as 37 successful model decisions.

## What is still missing for a model comparison

A Jev-versus-SemIf/djev comparison needs the same contract inputs and human labels, actual model versions and raw scores, per-provider token/cost/latency records, and a held-out set after threshold selection. Measure unsupported acceptances, false rejections, and total research cost with and without screening. The one live rejection is useful integration evidence; it is not enough to estimate those rates.

Source paths are relative to the Kalshi project: `work/check-research.mjs`, and `outputs/kalshi-pilot/{providers,core,engine,store,config}.mjs` with its `tests/core.test.mjs` and `tests/config.test.mjs`. The original Context Platform results remain separate: [labeled model evaluations](./jev-context-platform-evals.json) and [methodology](./jev-context-platform-notes.md).
