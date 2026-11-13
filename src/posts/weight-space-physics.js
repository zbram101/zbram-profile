const sources = {
  weights: {
    label: 'Weight-Space Programming — Rikiya Takehi and collaborators',
    url: 'https://rikiyat.github.io/blog/weight-space-programming/'
  },
  mujoco: { label: 'MuJoCo physics engine', url: 'https://mujoco.org/' }
};

export const weightSpacePhysicsPost = {
  slug: 'editing-neural-network-weights-for-physics',
  title: 'Can we edit a neural network’s understanding of physics?',
  excerpt: 'I tested direct weight edits in MuJoCo. The early results explain why my next experiment starts with a better baseline.',
  date: 'November 12, 2026',
  readTime: '3 min read',
  tags: ['Weight-Space Programming', 'MuJoCo', 'World Models'],
  hero: '/images/weight-space-physics.svg',
  heroAlt: 'A neural network connects to a physical trajectory: a conceptual illustration of editing a model of motion.',
  heroDiagram: 'physics-experiment',
  body: [
    {
      heading: 'The idea: edit the learned behavior',
      paragraphs: [
        'One of my recent physics experiments lost to a baseline that predicted no motion. That failure sharpened the question I started with: can we change a neural network’s behavior by editing its weights directly?',
        'Most models learn through optimization: training data and a loss function guide repeated parameter updates. Weight-space programming asks whether an LLM can inspect another network’s parameters and deliberately modify them without gradient descent. Research by Rikiya Takehi and collaborators inspired me to investigate this in physical prediction.',
        'My target is a world model: a network trained to predict how a physical system changes over time. I want to understand whether a designed weight edit can correct a specific predictive failure, and whether that correction holds beyond the examples used to design it.'
      ],
      references: [sources.weights]
    },
    {
      heading: 'The experiment needs controls',
      paragraphs: [
        'MuJoCo supplies simulated motion through environments such as Reacher, Hopper, and HalfCheetah. I collect state transitions, train a predictor, then compare its predictions with the simulator’s outcomes.',
        'The workflow above shows the comparisons I’m building: an unchanged model, a targeted edit, random edits, and conventional fine-tuning. Each needs the same held-out trajectories and prediction horizons. Otherwise, an apparent improvement might reflect an easier evaluation or more opportunities to tune.',
        'The unchanged model measures what the edit contributes. Random edits test whether a carefully designed change adds value beyond perturbation. Fine-tuning tests whether direct editing offers anything over ordinary adaptation. A successful edit also needs checks for regressions outside the behavior it targets.'
      ],
      references: [sources.mujoco]
    },
    {
      heading: 'The pilot failed',
      paragraphs: [
        'The first CPU experiments showed no convincing gain. Reacher performance deteriorated by approximately 4.55%; HalfCheetah barely changed; Hopper improved by just 0.86% on average against a weak custom baseline.',
        'A later prediction pilot lost at both horizons to a baseline that simply held the initial state constant. Its error increased sharply over longer rollouts. These are development measurements from my notes, comparable only within this setup.'
      ],
      table: {
        variant: 'metrics',
        caption: 'Raw prediction error · lower is better',
        columns: ['Horizon', 'Pilot model', 'Hold initial state'],
        rows: [
          ['32 steps', '162.08', '55.71'],
          ['100 steps', '1,128.57', '58.92']
        ]
      }
    },
    {
      heading: 'What I’m testing next',
      paragraphs: [
        'First, establish a predictor that reliably beats the hold-state baseline. I need to understand where rollout error starts and how it accumulates before attributing a change to better physical modeling.',
        'Then, isolate a predictive failure, design an edit, and evaluate every comparison on separate trajectories. The question is whether the edit changes the intended behavior while preserving predictions elsewhere. A lower average error could hide a serious regression in a different movement or horizon.',
        'Evaluation also needs repeated runs. A small gain on one seed or one rollout is weak evidence. I want to record which parameters changed, how the edit was chosen, and whether the effect repeats. That record should help distinguish a targeted correction from a lucky perturbation.',
        'Robot control comes later. Predicting motion and selecting useful actions are separate tasks; a prediction improvement would still need to prove useful for planning.',
        'The experiment has not demonstrated programmable physics. It has identified a prerequisite: the underlying predictor must be strong enough that an editing result means something. My next milestone is a reliable baseline and a reproducible comparison.'
      ]
    }
  ],
  sources: Object.values(sources)
};
