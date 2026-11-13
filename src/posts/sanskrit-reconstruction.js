const sansar = {
  label: 'Sansar 700M — model card and limitations',
  url: 'https://huggingface.co/MuseMesh/sansar-700m'
};

export const sanskritReconstructionPost = {
  slug: 'ai-and-missing-sanskrit-texts',
  title: 'Can AI help reconstruct missing Sanskrit texts?',
  excerpt: 'I’m building a research platform to test how surviving fragments, quotations, and commentaries could constrain proposed reconstructions.',
  date: 'November 12, 2026',
  readTime: '3 min read',
  tags: ['Sanskrit', 'Knowledge Graphs', 'AI Research'],
  hero: '/images/sanskrit-evidence.svg',
  heroAlt: 'Manuscript pages connect to an evidence graph, with solid links for explicit references and dashed links for inferred similarities.',
  heroDiagram: 'sanskrit-evidence',
  body: [
    {
      heading: 'Start with what survives',
      paragraphs: [
        'A missing Sanskrit passage may leave traces elsewhere: a quotation in a commentary, a fragment in another manuscript, or a reference to an argument. I’m interested in whether AI can assemble those traces and propose completions that scholars can examine.',
        'That work begins with sources. Hindu texts and their commentaries are distributed across archives, languages, editions, and manuscript witnesses. Before generating a candidate passage, a system needs to identify which evidence survives, where it comes from, and where accounts disagree.',
        'I’m building a research platform around that requirement. The first task is to make the surviving evidence searchable and traceable. Reconstruction comes after we can inspect the sources supporting a proposed reading.'
      ]
    },
    {
      heading: 'Build the evidence graph',
      paragraphs: [
        'The current checkpoint contains 880 provisional source records and editions, and 1,337,317 indexed passages. It supports catalog search, passage exploration, graph-backed research, and evidence dossiers with citations. These counts describe indexed material; they do not establish complete coverage or scholarly validation.',
        'The graph connects texts, editions, manuscript witnesses, and passages. It also records relationships among sources. A quotation has a different evidentiary status from a commentator’s interpretation or a model’s suggestion that two ideas resemble each other.',
        'That distinction matters. Similarity alone cannot establish historical influence. Each connection needs its source, relationship type, uncertainty, and review status. A researcher should be able to follow a claim back to the passage supporting it and see competing interpretations.',
        'The planned research harness would use this structure to assemble cited investigations while preserving disagreements and unresolved questions.'
      ]
    },
    {
      heading: 'Generate constrained candidates',
      paragraphs: [
        'I’m exploring adaptation of Sansar 700M, a roughly 704-million-parameter Sanskrit language model trained from scratch. It is a base text-completion model. Whether specialization on curated material improves reconstruction remains an experimental question.',
        'The proposed inputs are surviving fragments, verified quotations, relevant commentary, and linguistic context. Grammar, vocabulary, meter where applicable, and differences between manuscript witnesses would constrain the candidates. Different witnesses may support multiple candidates rather than one answer.',
        'The output would be a proposed completion with its supporting evidence and unresolved conflicts. The system must keep attested text, scholarly inference, and generated reconstruction distinguishable. No lost scripture has been recovered in this project.'
      ],
      references: [sansar],
      diagram: 'sanskrit-reconstruction'
    },
    {
      heading: 'Test on passages we can check',
      paragraphs: [
        'The first experiment would hide part of a known passage, then ask the model to reconstruct it using only permitted surrounding evidence. The evaluator retains the original for comparison.',
        'I would compare the base model with an adapted version and vary the available context. Does a quotation help? Does commentary improve the result, or steer it toward a later interpretation? Evaluation would consider similarity to the original, grammar, meter, consistency with sources, and unsupported invention.',
        'Memorization is a separate concern. A passage hidden during evaluation may already exist in pretraining or adaptation data. Source splits and overlap checks are necessary to interpret the scores.',
        'Success on these controlled gaps would justify further experiments. It would not authenticate a completion of a genuinely lost work. My next milestone is a reconstruction test whose evidence, comparison, and failure cases a scholar can inspect.'
      ]
    }
  ],
  sources: [sansar]
};
