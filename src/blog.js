export const posts = [
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
