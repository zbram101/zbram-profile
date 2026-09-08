export const posts = [
  {
    slug: 'astra-the-good-and-the-bad',
    title: 'Astra: the good and the bad',
    excerpt: 'A candid note on what is exciting about Astra, the tradeoffs worth naming, and how we will keep learning from the rollout.',
    date: 'September 7, 2026',
    readTime: '4 min read',
    tags: ['Product', 'Lessons learned'],
    body: [
      { heading: 'The good', paragraphs: ['Astra is built around a simple idea: make the useful path obvious. Its focused experience gives people a clear place to start and gives the team room to obsess over the details that create trust.', 'The rollout is intentionally incremental. That lets us learn from real use, improve quickly, and keep decisions connected to the people the product is meant to serve.'] },
      { heading: 'The bad — and the honest tradeoffs', paragraphs: ['Focus means not every workflow is covered on day one. Early users will find edges that are still taking shape, and some desired capabilities will need to wait until the foundation can support them well.', 'There is also a real tension between moving quickly and earning confidence. Reliability, privacy, and a coherent experience are not things to bolt on later. We will keep testing fast, while keeping clear guardrails around what is ready to scale.'] },
      { heading: 'What comes next', paragraphs: ['The goal is a dependable core experience that people return to because it is genuinely useful. We will use feedback, repeat use, and reliability—not vanity metrics alone—to decide what deserves to be built next.'] }
    ]
  },
  {
    slug: 'goloadout-architecture-goals-and-plans',
    title: 'goLoadout: architecture, goals, and plans',
    excerpt: 'How goLoadout is being shaped around a portable tactical gaming identity—and the system designed to let it grow with the community.',
    date: 'September 7, 2026',
    readTime: '5 min read',
    tags: ['goLoadout', 'Architecture', 'Roadmap'],
    body: [
      { heading: 'The goal', paragraphs: ['goLoadout is built on the belief that a tactical gaming identity should not stop at the screen. The goal is to give players a home for the gear, style, and connections that make their identity feel personal—online and in the field.', 'The product should make that identity easy to express, easy to carry, and useful to the communities that form around shared play.'] },
      { heading: 'Architecture that can evolve', paragraphs: ['The product is designed in clear layers: an experience layer for a fast, visual player-facing interface; a domain layer for profiles, loadouts, and the rules that connect them; and integration services that can connect the experience to the places players already gather.', 'Keeping these concerns separate gives goLoadout room to improve individual capabilities without destabilizing the whole product. It also keeps the important boundaries explicit: identity, permissions, data, and community interactions should be observable and intentional from the beginning.'], callout: 'Design principle: the identity belongs to the player; the platform should make it easier to express and use.' },
      { heading: 'The plan', paragraphs: ['First, we are focused on a strong core: a compelling identity, useful loadouts, and a simple path to share them. From there, the roadmap can deepen the community and real-world connections that make the platform distinct.', 'The direction will stay responsive to early users. The best next feature is the one that makes goLoadout more valuable to the people already choosing to bring it with them.'] }
    ]
  },
  {
    slug: 'showing-up-more-on-social',
    title: 'I’m going to be more engaged on social media',
    excerpt: 'A commitment to share more of the work, lessons, and questions behind the products I am building.',
    date: 'September 7, 2026',
    readTime: '2 min read',
    tags: ['Building in public', 'Community'],
    body: [
      { heading: 'More of the work behind the work', paragraphs: ['I am going to show up more consistently on social media. Not just for launches and polished announcements, but for the decisions, experiments, and lessons that happen while something is still being built.', 'I will share practical notes on product thinking, architecture, engineering leadership, and the projects I am working on. I am also looking forward to learning from people who are building in adjacent spaces.'] },
      { heading: 'The promise', paragraphs: ['The goal is useful conversation, not noise. I will be thoughtful about what I share, honest about what is still uncertain, and open to the feedback that makes the work better.'] }
    ]
  }
];
