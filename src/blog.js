import { jevContextPlatformPost } from './posts/jev-context-platform.js';

export const posts = [
  jevContextPlatformPost,
  {
    slug: 'context-platform-strategy-features-and-tradeoffs',
    title: 'Context Platform: BI by AI, with repeatable intelligence',
    excerpt: 'Business intelligence powered by AI, built around reusable analytical methods. How Context Platform connects data, personal, and process context—and where its features, strategy, and tradeoffs fit in the market.',
    date: 'September 19, 2026',
    readTime: '10 min read',
    tags: ['Context Platform', 'BI by AI', 'Repeatable Intelligence'],
    hero: '/images/context-platform-hero.svg',
    heroAspectRatio: '2 / 1',
    heroAlt: 'Data, personal, and process context converge into an inspectable answer.',
    body: [
      {
        heading: 'BI by AI, with repeatable intelligence',
        paragraphs: [
          'Context Platform is my approach to business intelligence powered by AI, built around repeatable intelligence. The product goal is to let someone start with a business question, use AI to investigate governed data, and turn a useful analysis into a method that can be applied across people and reporting cycles.',
          'Ask an AI assistant, “How is my region performing?” and the difficult part starts before any SQL runs. What does performance mean? Which region belongs to this person? Which dates matter? Is the question about booked sales, recognized revenue, or margin? A query can execute perfectly and still answer a different question from the one the business intended.',
          'The context layers make that BI experience possible. They capture what the business means, what applies to the person asking, and how an analysis should be carried out. An answer should carry the definitions and assumptions that produced it, so someone else can inspect, challenge, and build on the work.'
        ],
        callout: 'Project snapshot: September 19, 2026. This article draws on the Context Platform codebase and build plans. Core analytics and personal context are implemented; process authoring and composition are local development increments. The complete process lifecycle remains planned.'
      },
      {
        heading: 'What repeatable intelligence means',
        paragraphs: [
          'Repeatable intelligence means preserving the useful structure of an analysis: the business definitions, the applicable scope, the required inputs, and the steps that make the result meaningful. Once a team agrees on a sales review, the product direction is to make that method reusable for the next month or another manager’s territory, with each run showing the choices and evidence behind it.',
          'The AI helps people ask questions, explore results, perform calculations, and explain findings. The governed definitions and process contracts preserve the method. Human review establishes which meanings and methods deserve to be reused. This is how an individual investigation can become a shared BI capability.',
          'Repeatability lives in those definitions, inputs, and methods. Results can change as source data, reporting periods, or responsibilities change, and AI explanations can vary. The system should make those differences explainable. The current product supplies the semantic and personal foundations; the complete reusable process experience is the next milestone.'
        ]
      },
      {
        heading: 'The strategy: make intelligence reusable through context',
        paragraphs: [
          'Data context defines the shared meaning of a metric: its calculation, supported dimensions, relationships, policies, and released version. Personal context captures the person’s accepted responsibilities, preferences, and reporting scope, including when those facts apply. Process context describes a reusable method: the steps, required inputs, fixed choices, and personal bindings needed to carry out a particular analysis.',
          'Together, they create a useful separation of responsibilities. The business owns what “sales revenue” means. A person owns their accepted profile. A process author defines how a sales review should work. The platform resolves those inputs into a constrained query and records where each choice came from.',
          'The commercial hypothesis is to start with recurring BI reviews in one well-defined business domain. A data or analytics leader sponsors the pilot; a domain expert curates definitions; analysts and managers use the results. The entry point is a business question and a useful review. The initial value should be faster analysis, fewer repeated explanations, and less time rebuilding the same investigation. Expansion into other domains should follow evidence that this first workflow is useful.'
        ],
        diagram: 'context-platform-layers'
      },
      {
        heading: 'What the working product already does',
        paragraphs: [
          'The foundation is a governed path from definition to answer. Neo4j stores semantic definitions and their relationships; PostgreSQL remains the source of business data. The application combines a React and TypeScript interface with a Python API. AdventureWorks provides the bundled demonstration, while configuration and scoped memberships support additional PostgreSQL workspaces.'
        ],
        bullets: [
          { label: 'Versioned business definitions', text: 'Authors create drafts and inspect semantic changes. Independent reviewers approve specific revisions; publishers create immutable releases, promote them through channels, and roll back channel pointers. Release checks validate semantic contracts and live bindings.' },
          { label: 'Constrained query execution', text: 'The assistant selects structured metrics, dimensions, filters, and periods. A deterministic compiler produces parameterized SQL from reviewed definitions and approved sources. The query interface rejects arbitrary client SQL, and the source connection executes read-only queries.' },
          { label: 'Analysis with evidence', text: 'Chat can query repeatedly, analyze selected result snapshots with hosted Python, and produce charts and CSVs. Answers expose query evidence, calculations, and release provenance. Recorded token usage and estimated costs help explain the work behind an answer.' },
          { label: 'Context people can inspect', text: 'Search, term resolution, Query Studio, and an interactive relationship graph help users explore released definitions. Ambiguous terms and incompatible metric/dimension combinations can become explicit errors or clarification requests.' },
          { label: 'Shared behavior across interfaces', text: 'The web experience, HTTP API, Python and TypeScript clients, and MCP tools use the same governed services. A tool integration does not get a separate path around the validator.' }
        ]
      },
      {
        heading: 'Personal context: useful defaults with a history',
        paragraphs: [
          'My Context adds owned profiles for responsibilities, project membership, metric preferences, grouping, filters, reporting periods, and answer style. A user can enter statements directly or review interview suggestions before saving them. The current implementation does not silently turn conversations into long-term memories.',
          'Time matters here. “I manage Canada” can be true for one period and false for another. The platform distinguishes when a statement applies from when the system learned it, preserves corrections, and records the personal assumptions used in a query. Conflicting defaults require clarification, and explicit query choices can override applicable defaults.',
          'These profiles describe analytical scope; they do not grant database access. Membership and source permissions remain separate controls. A saved region preference is useful context, but it is not row-level security.',
          'Forgetting is also an explicit operation. The implemented cleanup invalidates affected plans and removes derived context, answers, and artifacts within the application’s defined boundary. It does not erase previously downloaded files, backups, provider records, or separately retained original user messages.'
        ]
      },
      {
        heading: 'Process context: the next step toward repeatable intelligence',
        paragraphs: [
          'The next layer makes a familiar request reusable: “Review sales revenue by channel for the territory the person manages.” The shared process should store the requirement for an accepted territory filter. The actual value—Canada, for example—belongs to the person’s private run. Copying an author’s personal territory into every future user’s workflow would be a subtle but serious mistake.',
          'Local development now includes typed query/end-step contracts, candidate discovery from released definitions, manual process authoring, server validation, and draft downloads. An internal composer can freeze the process inputs, semantic definitions, source descriptors, and personal evidence, then produce deterministic query plans with provenance. Sales and support fixtures exercise this path.',
          'That is an implementation foundation. Browser drafts are not yet a durable process registry. Process persistence, independent publication, owned runs, and the full execution lifecycle remain pending. Optional AI assistance for mapping an author’s description to approved fields is also planned; it would propose choices for review while the compiler remains responsible for executable plans.'
        ],
        callout: 'The three-context design is the product direction. A completed, published, end-to-end process experience is not yet a shipped capability.'
      },
      {
        heading: 'A concrete example: the monthly sales review',
        paragraphs: [
          'Consider a manager reviewing Canada’s sales by channel for a specified month. In the sample domain, sales revenue is the order subtotal, excluding tax and freight. That definition is booked sales; it should not be presented as accounting-recognized revenue or profit.',
          'The current query and personal-context path can combine that released definition with an accepted Canada filter and an explicit reporting period. The answer can show which definition and personal assumptions were used. The proposed process layer would package those choices into a reusable review, require missing inputs, and keep each participant’s scope separate.',
          'This illustrates the kind of repeatability I want: a shared definition and method, with a visible reason for differences between people’s results. Pinning definitions alone does not freeze the underlying database. Reproducing an old number still requires the original result snapshot or an appropriate historical data source.'
        ]
      },
      {
        heading: 'Where it sits in the market',
        paragraphs: [
          'I place Context Platform in AI-powered BI, with repeatable intelligence as its product focus. The comparison is therefore about both the immediate analysis experience and how well a useful method can carry into the next review. Governed semantics, conversational analytics, and reusable context already exist in substantial products. The table summarizes current vendor documentation; the fit and tradeoff judgments are my assessment, not a benchmark or a claim of feature superiority.'
        ],
        table: {
          caption: 'Market comparison · vendor sources checked September 19, 2026',
          columns: ['Platform', 'What it offers', 'How I would weigh it'],
          rows: [
            [
              { text: 'Snowflake Cortex Agents', href: 'https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents' },
              'Managed agents combining structured queries through Cortex Analyst semantic views, unstructured retrieval through Cortex Search, and tools such as Python execution.',
              'A natural starting point for teams already governed in Snowflake. Its managed execution is a substantial advantage. Context Platform must earn a place through its specific context workflows; it cannot claim unique ownership of governed analysis.'
            ],
            [
              { text: 'Databricks Genie', href: 'https://docs.databricks.com/aws/en/genie' },
              'Natural-language data exploration, dashboards, and apps on a Unity Catalog foundation. Genie Agents let teams configure trusted data, metrics, and business rules.',
              'A strong fit to evaluate when the organization already works in Databricks. Context Platform offers a smaller, independently operated application, with far less ecosystem breadth and no demonstrated enterprise-scale advantage.'
            ],
            [
              { text: 'Cube', href: 'https://docs.cube.dev/docs/introduction' },
              'An analytics platform built on an open-source semantic layer, with shared metrics, joins, access rules, caching, Analytics Chat, APIs, and MCP access.',
              'A close comparison for governed metrics and embedded analytics. Context Platform’s intended emphasis is on temporal personal evidence and reusable process bindings. That distinction needs user validation; a semantic layer and MCP endpoint alone are insufficient differentiation.'
            ],
            [
              { text: 'Atlan Context Engineering Studio', href: 'https://atlan.com/context-engineering-studio/' },
              'Atlan presents a workflow for assembling business context, evaluating it, deploying it to agents, and observing its use across a wider data estate.',
              'The closest strategic overlap in treating context as a product. Evaluate it when broad context integration is the main need. Context Platform currently focuses on a bounded structured-query experience; external catalog synchronization is explicitly excluded from its scope.'
            ],
            [
              { text: 'Context Platform', href: 'https://context.bharadwajramachandran.com' },
              'BI by AI, with repeatable intelligence as the goal: governed PostgreSQL analysis, semantic and personal context, and a process layer in development.',
              'A candidate for a focused pilot around recurring business reviews and reusable analytical methods. It still needs a finished process lifecycle, broader adapters, and operational evidence before making an enterprise platform claim.'
            ]
          ]
        },
        callout: 'Existing platform investment matters. A team with mature semantics and governance in one of these systems should first test whether its existing platform solves the workflow. Context Platform needs to demonstrate enough additional value to justify another system.'
      },
      {
        heading: 'The advantages I am building toward',
        paragraphs: [
          'The strongest advantages come from connecting context to execution and making the connection inspectable. They are design strengths with working foundations, not measured claims about customer outcomes.'
        ],
        bullets: [
          { label: 'Explainable differences', text: 'Two people can receive different results while sharing a metric definition. Recorded personal filters, time cutoffs, and explicit choices help explain why, instead of leaving the difference buried in a prompt.' },
          { label: 'Controlled change', text: 'Reviews, immutable releases, regression checks, and rollback provide a concrete way to evolve business definitions. Pinning the semantic release makes a changed interpretation easier to diagnose.' },
          { label: 'Predictable execution boundaries', text: 'Structured intent and reviewed bindings keep executable queries within supported operations. The model helps interpret the request; application code validates and compiles the query.' },
          { label: 'Intelligence that can be reused', text: 'The process direction would let a team carry an accepted analytical method into future reviews, with new periods and each person’s scope supplied explicitly. APIs and MCP allow the governed services to be used beyond the web interface.' }
        ]
      },
      {
        heading: 'The costs and limitations are real',
        paragraphs: [
          'The biggest risk is creating another place where people must maintain business knowledge. Definitions need owners, reviews take time, and profiles become stale. The product succeeds only if that effort is lower than the repeated clarification and reconciliation it removes.'
        ],
        bullets: [
          { label: 'Breadth is deliberately limited', text: 'The current source adapter supports PostgreSQL and bounded aggregate expressions on one target per query. Arbitrary joins, other database engines, and fiscal calendars require more work. Document ingestion, OCR, vector retrieval, and hybrid document/data workflows remain later phases.' },
          { label: 'The process experience is incomplete', text: 'Local authoring and composition do not establish production-ready process publication or execution. Those milestones still carry implementation and rollout risk.' },
          { label: 'Governance cannot repair bad meaning', text: 'An approved but incorrect metric remains incorrect. Source quality, domain review, ambiguity handling, and comparison against known answers remain essential. Plausible prose is not proof of a correct interpretation.' },
          { label: 'There is an operating burden', text: 'The application, graph registry, source databases, identities, migrations, backups, and model usage all need care. Recorded AI costs are estimates, not a full operating-cost ledger. No enterprise SLO or throughput benchmark has been established.' },
          { label: 'The competitive gap can narrow', text: 'Larger platforms already offer substantial semantic, agent, and context capabilities. The product must show that its particular combination of personal history and repeatable methods is useful enough to adopt and maintain.' }
        ]
      },
      {
        heading: 'What I would prove next',
        paragraphs: [
          'First, finish the process lifecycle: durable drafts, independent review, immutable publication, owned runs, and live access and erasure checks across those records. Then test a complete recurring review with real domain experts before expanding the connector list.',
          'The pilot should measure agreement with analyst-approved reference answers, time from question to an accepted result, how often scope needs correction, and how often a published process is reused. It should also track the effort to maintain definitions and profiles, failed or unsupported requests, and total operating cost. These are proposed evaluation criteria; the project has not demonstrated these outcomes yet.',
          'The product I am building is BI by AI, with repeatable intelligence. Its value should grow as teams preserve useful definitions, accepted scope, and reviewed methods—and apply them to the next business question. Context Platform brings those pieces together so people can spend more time understanding what changed and deciding what to do next.'
        ]
      }
    ],
    sources: [
      { label: 'Context Platform — project site', url: 'https://context.bharadwajramachandran.com' },
      { label: 'Snowflake — Cortex Agents documentation', url: 'https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents' },
      { label: 'Databricks — Genie documentation', url: 'https://docs.databricks.com/aws/en/genie' },
      { label: 'Cube — platform and semantic layer documentation', url: 'https://docs.cube.dev/docs/introduction' },
      { label: 'Atlan — Context Engineering Studio product overview', url: 'https://atlan.com/context-engineering-studio/' }
    ]
  },
  {
    slug: 'data-agent-feedback-openai-feature',
    title: 'When feedback becomes part of the product story',
    excerpt: 'OpenAI featured my perspective in its launch article for the Data agent in ChatGPT Work. Here is what that moment means to me—and what I learned from testing the product in an enterprise setting.',
    date: 'September 10, 2026',
    readTime: '5 min read',
    tags: ['Data agent', 'ChatGPT Work', 'Enterprise AI'],
    hero: '/images/data-agent-openai-feature.png',
    heroAlt: 'OpenAI customer examples page featuring Bharadwaj Ramachandran’s quote about the Data agent in ChatGPT Work.',
    body: [
      {
        heading: 'A note I was glad to see',
        paragraphs: [
          'Seeing my perspective in an OpenAI release article was a meaningful moment: exciting, humbling, and worth saving a screenshot of.',
          'What I value most is the opportunity behind it. I was able to review the tools early, share feedback from an enterprise perspective, and help shape how a broader vision for business intelligence could be understood and shared.',
          'The article is about a bigger idea than a single quote. The Data agent is designed to help people connect to trusted company data, investigate questions in plain language, build interactive dashboards, and turn analysis into action. My perspective appears alongside examples from other organizations in the program.'
        ]
      },
      {
        heading: 'The work behind the quote',
        paragraphs: [
          'I had the opportunity to test the Data agent and share feedback from an enterprise perspective. That meant looking at it through the lens of real teams, existing data environments, and the practical questions that come up when analysis has to support a decision—not just produce an impressive demo.',
          'The most interesting part was seeing how a conversational interface can change the starting point for analysis. Instead of first translating a question into a query, finding the right dashboard, or waiting for someone else to prepare a report, a user can begin with the business question itself and then refine the investigation from there.',
          'That does not remove the need for data quality, governance, or subject-matter expertise. It makes those foundations more visible. Definitions, permissions, relationships between data, and the ability to inspect evidence are what turn a fast answer into a useful one.'
        ]
      },
      {
        heading: 'Why the Data agent matters',
        paragraphs: [
          'Many organizations do not have a shortage of data. They have a shortage of time and shared context around the data. People know the question they want answered, but the path from that question to a reliable insight can be slow and highly dependent on a small number of analysts or engineers.',
          'The Data agent points toward a more accessible model: ask a question, examine the reasoning and evidence, ask follow-ups, and shape the result into something the team can use. OpenAI describes support for approved data connections, semantic layers, interactive dashboards, and connected tools for sharing or carrying out approved actions.',
          'For me, the promise is not “AI replaces analytics.” It is that more people can participate in analysis while analytics teams spend more of their time on the harder work: improving the underlying data, defining meaningful metrics, and helping the organization make better decisions.'
        ]
      },
      {
        heading: 'Three things testing reinforced for me',
        paragraphs: [
          'First, context is a product feature. A model can be capable, but it still needs the organization’s definitions and relationships to understand what a metric actually means. Trusted context is what keeps natural-language analysis connected to the business.',
          'Second, confidence comes from inspection. A useful data experience should make it easy to ask follow-up questions, review the evidence behind a finding, and compare the result with the reports and processes a team already relies on.',
          'Third, adoption is human. The best tool is not the one that produces the most elaborate dashboard. It is the one that helps someone move from uncertainty to a clear next question, and then to a decision they can explain to someone else.'
        ]
      },
      {
        heading: 'A meaningful milestone—and a beginning',
        paragraphs: [
          'Being included in the article feels meaningful because it captures a particular kind of contribution: using an early product seriously, sharing what works and what needs attention, and helping the team understand how the experience lands in a real organization. I am grateful that perspective made it into the story.',
          'I also see the quote as a snapshot, not a finish line. Enterprise AI earns its place through repeated use, careful validation, and measurable impact over time. The next chapter is watching how tools like the Data agent evolve as teams learn where conversational analysis genuinely helps—and where human judgment remains essential.',
          'For now, I am simply happy to have played a small part in the feedback loop, and very happy to see that part of the journey documented.'
        ],
        callout: 'The official OpenAI article includes the original customer example and describes the Data agent’s capabilities and participating organizations.'
      }
    ],
    sources: [
      { label: 'OpenAI — Now everyone can put data to work', url: 'https://openai.com/index/put-data-to-work/' }
    ]
  },
  {
    slug: 'astra-the-good-and-the-bad',
    title: 'Astra: AGI is here',
    excerpt: 'GPT-6 Astra feels less like another model upgrade and more like a boundary crossing. Here is the evidence, the recurrent-compute lens, and the caveats behind my take that AGI is here.',
    date: 'September 7, 2026',
    readTime: '10 min read',
    tags: ['GPT-6 Astra', 'AGI', 'Architecture'],
    hero: '/images/astra-agi-hero.jpg',
    heroAlt: 'Abstract luminous loops connecting tools, documents, charts, and software tasks.',
    body: [
      {
        heading: 'The line has moved',
        paragraphs: [
          'My reaction to GPT-6 Astra is simple: this is a mind-blowing leap. I do not mean that every benchmark is solved or that the system never fails. I mean the center of gravity has shifted—from a model that answers questions to a general system that can carry difficult work across tools, interfaces, code, research, and documents.',
          'OpenAI describes Astra as its most capable broadly deployed model. The published results show state-of-the-art performance across computer use, professional work, coding, science, long context, and abstract reasoning. The breadth matters more to me than any single score: the same system can understand an objective, operate software, revise its approach, and produce a usable artifact.'
        ]
      },
      {
        heading: 'What I mean by “AGI is here”',
        paragraphs: [
          'OpenAI’s charter defines AGI as highly autonomous systems that outperform humans at most economically valuable work. Astra does not prove every word of that definition in every environment, and OpenAI has not declared that the AGI milestone has been reached.',
          'My claim is a practical one. When a single system can perform expert-level reasoning across domains, navigate real software, use tools over long workflows, recover from ambiguity, and produce work rather than merely advice, the old “narrow AI” frame stops being useful. We can debate the finish line; the operating reality has already changed.'
        ],
        callout: 'This is my interpretation of the evidence—not an official OpenAI declaration that AGI has been achieved.'
      },
      {
        heading: 'The jump, in numbers',
        paragraphs: [
          'Astra’s strongest story is the shape of the gains. It improves conventional coding and professional-work results, but the striking changes appear in agentic work, long-horizon science, computer use, and abstract reasoning. The chart below uses figures published by OpenAI and compares Astra with GPT-5.6 Sol where both were reported.'
        ],
        diagram: 'astra-benchmarks'
      },
      {
        heading: 'The recurrent-model question',
        paragraphs: [
          '“Recurrent model” can mean several different things. A classic recurrent neural network passes a hidden state from one token or time step to the next. A recurrent-depth system instead applies a shared computation block repeatedly, allowing harder problems to receive more internal computation. At the product level, an agent can also look recurrent: observe, reason, act, inspect the result, and repeat.',
          'OpenAI has not publicly disclosed Astra’s underlying neural architecture or confirmed that it uses recurrent layers or recurrent depth. So it would be inaccurate to reverse-engineer a hidden architecture from behavior alone. What is public is the system-level pattern: reasoning tokens, persisted reasoning, compaction, long context, tool use, async tool calling, and mid-turn steering let work continue through repeated cycles rather than a single prompt-and-answer pass.'
        ],
        diagram: 'recurrent-lens'
      },
      {
        heading: 'Why it feels qualitatively different',
        paragraphs: [
          'The previous generation made impressive artifacts. Astra appears better at preserving intent while the task expands. It can work across a browser and terminal, use context without echoing all of it back, handle steering without throwing away completed work, and choose when missing information is truly consequential.',
          'That combination changes the economics of delegation. Per-token pricing is higher than Sol, but OpenAI reports that Astra can use substantially fewer output tokens on several hard tasks. The right unit is no longer the price of a response; it is the cost of a completed, reviewable outcome.'
        ]
      },
      {
        heading: 'The good—and the part we cannot hand-wave',
        paragraphs: [
          'The good is extraordinary: broader competence, stronger computer use, better long-context retrieval, higher-quality professional artifacts, and more consistent respect for user intent. Astra also supports a 1.05-million-token context window and up to 128,000 output tokens through the API.',
          'The caveat is equally real. OpenAI classifies Astra at the Critical level for cybersecurity capability and reports that its written reasoning is harder to monitor than Sol’s under adversarial evaluation. The model is also more robustly aligned overall, but capability and risk are advancing together. An AGI-level claim should increase the demand for careful deployment, human judgment, and defense in depth—not reduce it.'
        ]
      },
      {
        heading: 'What I am watching next',
        paragraphs: [
          'I want to see how the leap holds up outside benchmark harnesses: messy requirements, partial access, contradictory stakeholders, long-running projects, and the slow feedback loops of real organizations. Reliability across weeks matters more than brilliance in a single session.',
          'But I am done treating this as a slightly better chatbot. Astra is a general-purpose work system. Whether history names this exact release as the arrival of AGI or as the final step before it, the practical response is the same: learn how to direct it, verify it, and redesign work around what has become possible.'
        ]
      }
    ],
    sources: [
      { label: 'GPT-6 Astra: A new generation of intelligence', url: 'https://openai.com/index/gpt-6-astra/' },
      { label: 'GPT-6 Astra model documentation', url: 'https://developers.openai.com/api/docs/models/gpt-6-astra' },
      { label: 'Safety overview: GPT-6 Astra', url: 'https://openai.com/index/safety-overview-gpt-6-astra/' },
      { label: 'OpenAI Charter', url: 'https://openai.com/charter/' }
    ]
  },
  {
    slug: 'goloadout-architecture-goals-and-plans',
    title: 'goLoadout: architecture, goals, and plans',
    excerpt: 'A public product blueprint for a portable tactical gaming identity—using C4 and dynamic views without exposing security-sensitive implementation details.',
    date: 'September 7, 2026',
    readTime: '9 min read',
    tags: ['goLoadout', 'C4 Architecture', 'Roadmap'],
    hero: '/images/goloadout-architecture-hero.jpg',
    heroAlt: 'A player identity connected to a modular loadout and a wider gaming community.',
    body: [
      {
        heading: 'A tactical identity that travels',
        paragraphs: [
          'goLoadout starts from a simple product belief: a tactical gaming identity should not stop at the screen. Players invest thought in their equipment, style, role, and community. The product gives those choices a portable home that can travel from an individual profile to a loadout and into the places where people play together.',
          'That makes the core goal larger than cataloging gear. goLoadout should help a player express an identity, prepare for play, share useful context, and discover connections—without taking ownership away from the player.'
        ]
      },
      {
        heading: 'C4 level 1: system context',
        paragraphs: [
          'The C4 model begins with context: who uses the system, what they want from it, and which outside systems matter. This public view intentionally stays at the product boundary. It shows relationships and responsibilities, not deployment topology, credentials, private interfaces, or internal controls.'
        ],
        diagram: 'goloadout-context'
      },
      {
        heading: 'C4 level 2: container responsibilities',
        paragraphs: [
          'The next zoom level divides goLoadout into major runtime responsibilities. The player experience handles profile and loadout interaction. The product services own the rules behind identity, loadouts, publishing, and community connections. Media storage manages player-selected assets, while the product data store preserves the player-owned record.',
          'This is a logical container view rather than a disclosure of the production environment. Technology names, network details, access rules, provider configuration, and operational topology are deliberately omitted from a public article.'
        ],
        diagram: 'goloadout-containers'
      },
      {
        heading: 'A dynamic view of the core journey',
        paragraphs: [
          'Static architecture explains what exists. A dynamic view explains how those parts collaborate during a real use case. The core journey is intentionally short: establish identity, assemble a loadout, preview what will be shared, then publish it to a community touchpoint.',
          'The preview step matters. It gives the player a clear boundary between private work-in-progress and intentionally shared identity. That is both a product principle and a clean responsibility boundary.'
        ],
        diagram: 'goloadout-dynamic'
      },
      {
        heading: 'Decisions behind the shape',
        paragraphs: [
          'The architecture follows the product loop. Identity and loadouts are related but remain separable, so each can evolve without forcing a rewrite of the other. Publishing is treated as an explicit capability rather than a side effect. External communities are integrations, not the source of truth for a player’s identity.',
          'Those boundaries support a gradual roadmap. The system can deepen individual value first, then add community value without making the early experience depend on network scale.'
        ],
        callout: 'Public architecture rule: describe responsibilities and relationships; omit anything that would help someone map or operate the production environment.'
      },
      {
        heading: 'Roadmap: deepen before expanding',
        paragraphs: [
          'The first milestone is a strong individual loop: a compelling identity, useful loadouts, and a simple, deliberate way to share them. The next phase can add discovery and community features that make those existing objects more valuable.',
          'Later expansion should be earned by use. The best next feature is the one that increases the value of the player’s existing identity and loadouts—not the one that merely makes the roadmap look larger.'
        ]
      }
    ],
    sources: [
      { label: 'C4 model: diagrams', url: 'https://c4model.com/diagrams' },
      { label: 'C4 model: notation', url: 'https://c4model.com/diagrams/notation' }
    ]
  }
];
