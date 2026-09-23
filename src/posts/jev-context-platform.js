const sources = {
  intro: { label: 'TypeSafe: Jev interface', url: 'https://docs.typesafe.ai/introduction' },
  limits: { label: 'TypeSafe: known Jev 1.13 limitations', url: 'https://docs.typesafe.ai/model-jaggedness/jev-1.13' },
  community: { label: 'Hacker News launch discussion', url: 'https://news.ycombinator.com/item?id=49718492' },
  classifierTest: { label: 'Practitioner classification report (self-reported)', url: 'https://www.reddit.com/r/AI_India/comments/1wmvyqz/i_benchmarked_typesafes_jev_against_llms_bert_and/' },
  benchmark: { label: 'Independent JevBench results and methodology', url: 'https://github.com/fstandhartinger/jevbench/blob/main/RESULTS-v1.2.md' },
  semif: { label: 'SemIf (formerly OpenJev)', url: 'https://github.com/TheoLeeCJ/SemIf' },
  djev: { label: 'djev: open DiffusionGemma runtime', url: 'https://github.com/Davipar/djev-dev' },
  context: { label: 'My Context Platform evals', url: '/evidence/jev-context-platform-evals.json' },
  contextNotes: { label: 'Context Platform implementation and eval method', url: '/evidence/jev-context-platform-notes.md' },
  kalshi: { label: 'My Kalshi implementation evidence', url: '/evidence/jev-kalshi-pilot-notes.md' },
  kalshiFollowup: { label: 'Kalshi live check, paper observations, and 37 tests', url: '/evidence/jev-kalshi-pilot-followup.md' }
};

export const jevContextPlatformPost = {
  slug: 'jev-context-platform-implementation-and-evals',
  title: 'Jev: where it works, where it fails, and open alternatives',
  excerpt: 'Community findings and open alternatives, with the decisions, failures, and eval results from Context Platform and Kalshi Pilot.',
  date: 'September 22, 2026',
  readTime: '5 min read',
  tags: ['Jev', 'Community Research', 'Open Source'],
  hero: '/images/jev-context-platform-hero.svg',
  heroAspectRatio: '2 / 1',
  heroAlt: 'Jev research notes: classification and routing, precision and reasoning limitations, and open alternatives SemIf and djev.',
  body: [
    {
      heading: 'Where it fits',
      paragraphs: [
        'Jev takes supplied context and returns choices, scores, or yes/no values. My reading of the docs and community tests is that its best fit is a repeated, bounded judgment: route a request, classify a ticket, select a candidate, or screen material before expensive research. Those tasks can use a decision directly, without generating an explanation.',
        'That makes it relevant to agent infrastructure. It still leaves application code responsible for retrieval, permissions, arithmetic, and acting on the answer.'
      ],
      references: [sources.intro]
    },
    {
      heading: 'Where it struggles',
      paragraphs: [
        'TypeSafe’s own Jev 1.13 documentation lists unreliable counting, numerical precision, date comparisons, multi-hop reasoning, irrelevant context, and adversarial input. It also warns that answers to a question and its negation need not add up to one. Keep exact calculations and consistency checks in code.',
        'This is more specific than saying “AI makes mistakes.” A valid choice can still be wrong, and a threshold tuned for one question or answer type may fail on another.'
      ],
      references: [sources.limits]
    },
    {
      heading: 'What developers are saying',
      paragraphs: [
        'The Hacker News launch discussion captures both reactions: interest in classification, routing, and scoring, alongside objections to “can’t hallucinate” and broad comparisons with generative models. The useful distinction is between guaranteed output structure and a correct decision.',
        'One practitioner reported testing 500 examples per dataset and finding that a fine-tuned DistilBERT beat Jev by 12 percentage points on Banking77. The post does not publicly link its code, so I treat that as a self-report. It raises a useful comparison: when labels already exist, test a small task-specific classifier too.'
      ],
      references: [sources.community, sources.classifierTest]
    },
    {
      heading: 'Are the open alternatives getting close?',
      paragraphs: [
        'On some tasks, yes. SemIf, formerly OpenJev, reads decision probabilities from open models; djev uses DiffusionGemma without introducing new weights. These reproduce the decision-interface pattern, rather than Jev’s undisclosed training.',
        'Independent JevBench reports the following under its v1.3 scoring, across 534 frozen decisions. The overall score combines accuracy-derived intelligence, calibration, speed, and cost; it is not an accuracy percentage.'
      ],
      table: {
        variant: 'metrics',
        caption: 'JevBench · published results checked September 22, 2026',
        columns: ['System', 'Overall score', 'Standard accuracy', 'Hard accuracy'],
        rows: [
          ['Jev 1.13.0', '74.4', '99.0%', '74.1%'],
          ['SemIf · Qwen3.5-4B', '73.1', '97.9%', '59.5%'],
          ['djev · DiffusionGemma', '73.0', '97.9%', '69.5%']
        ]
      },
      callout: 'Close overall scores hide larger hard-task gaps. The hard tier is model-authored and cross-reviewed; some costs are estimates, and self-hosted latency is adjusted by assumption. These are published results I reviewed, not experiments I reran.',
      references: [sources.benchmark, sources.semif, sources.djev]
    },
    {
      heading: 'Context Platform: choosing definitions I can reuse',
      paragraphs: [
        'Context Platform is BI by AI with repeatable intelligence. Jev helps bind a request to released definitions: “booked revenue by sales channel for my accepted territory” maps, in stages, to sales → sales_revenue → sales_channel → region. It sees scoped candidates and confirmed choices; business rows and private profile values stay outside the request. The author accepts each suggestion, code rechecks scope and revision, and separate review precedes publication.',
        'The failures taught me more than the headline score. An unsupported sales-channel grouping for support tickets returned no_binding at 0.82 confidence, silently dropping something the request required. Another case selected the right resolution-time metric but scored 0.49, below my 0.5 acceptance floor, so the app asked for clarification. I changed the prompt to distinguish optional absence from unsupported requests and recognize equivalent metric meanings; I kept the floor unchanged.',
        'With prompt v4 and Jev 1.13.0, the final four runs matched 58/58 synthetic labels: 37 selections or intentional omissions and 21 clarifications. Per-run p95 adapter latency was 294–342 ms; recorded token cost totaled about $0.00147. Those are small, controlled runs, excluding app latency, review time, infrastructure, and earlier experiments.'
      ],
      callout: 'Only the final 12 cases were a fresh holdout after v4 was fixed. Other cases informed development or tested regression; workflow fixtures evaluated stages independently. This does not establish production accuracy or end-to-end reliability.',
      references: [sources.context, sources.contextNotes]
    },
    {
      heading: 'Kalshi Pilot: deciding whether to spend a research call',
      paragraphs: [
        'Here the decision is different. Code first checks contract eligibility and market conditions. Jev then scores whether the resolution rules are clear enough for evidence-based research. Scores below 0.8 stop there; passing contracts go to OpenAI research. Code checks sources, prices, fees, and exposure before any order. That 0.8 score concerns researchability, not the chance of winning.',
        'A saved live check made one Jev call, filtered the contract, and made zero OpenAI calls or exchange writes. This confirms that the screening path ran on a real contract; it does not tell me whether rejecting that contract was correct. Separately, all 37 mocked application tests passed, including rejection caching and avoiding OpenAI after a supplied low score.',
        'A later paper-run inspection recorded 48 skipped decisions: 38 for insufficient evidence and 10 for falling below the configured 19-percentage-point entry threshold. These are observed application outcomes, not labeled Jev accuracy. Insufficient evidence can arise downstream too, so I cannot attribute those 38 skips to Jev.',
        'This is where I would test SemIf or djev next: the same held-out binding cases in Context Platform, and a labeled contract set in Kalshi. I would compare false rejections, unsupported acceptances, latency, and combined research cost. The public benchmarks justify that comparison; my app evidence does not yet establish an interchangeable replacement.'
      ],
      references: [sources.kalshi, sources.kalshiFollowup]
    }
  ],
  sources: [sources.contextNotes, sources.kalshiFollowup, sources.benchmark, sources.limits, sources.semif, sources.djev]
};
