import React from 'react';

export function PhysicsExperiment() {
  const branches = [
    ['Unchanged', 'Baseline'],
    ['Targeted edit', 'Designed intervention'],
    ['Random edit', 'Perturbation control'],
    ['Fine-tune', 'Gradient adaptation']
  ];
  return <figure className="diagram research-diagram physics-experiment">
    <figcaption>How I’m testing weight edits</figcaption>
    <span className="research-status">Experiment design · controls being built</span>
    <div className="research-flow-start"><span>MuJoCo transitions</span><i aria-hidden="true">→</i><strong>Train one world model</strong></div>
    <div className="research-arrow" aria-hidden="true">↓</div>
    <ul className="research-branches">{branches.map(([label, detail]) => <li key={label}><strong>{label}</strong><span>{detail}</span></li>)}</ul>
    <div className="research-arrow" aria-hidden="true">↓</div>
    <div className="research-outcome"><strong>Same held-out trajectories</strong><span>Compare prediction error across horizons</span></div>
  </figure>;
}

export function SanskritEvidence() {
  return <figure className="diagram research-diagram sanskrit-evidence">
    <figcaption>What a source connection means</figcaption>
    <span className="research-status">Conceptual graph · relationship types stay distinct</span>
    <div className="evidence-chain"><span>Text</span><i aria-hidden="true">→</i><span>Edition / witness</span><i aria-hidden="true">→</i><strong>Passage</strong></div>
    <div className="evidence-relationships">
      <div><span>Passage A</span><span className="evidence-edge"><b>quotes</b><i aria-hidden="true">→</i></span><span>Passage B</span><small>Explicit reference</small></div>
      <div><span>Commentary</span><span className="evidence-edge"><b>interprets</b><i aria-hidden="true">→</i></span><span>Passage B</span><small>Attributed reading</small></div>
      <div className="evidence-inferred"><span>Passage C</span><span className="evidence-edge"><b>resembles</b><i aria-hidden="true">⇢</i></span><span>Passage B</span><small>Inference · needs review</small></div>
    </div>
  </figure>;
}

export function SanskritReconstruction() {
  const steps = [
    ['01', 'Hide a known passage', 'Evaluator retains the original'],
    ['02', 'Supply evidence', 'Fragments, quotations, context'],
    ['03', 'Generate candidates', 'Base model vs. adapted model'],
    ['04', 'Evaluate', 'Compare with original; scholarly review']
  ];
  return <figure className="diagram research-diagram reconstruction-workflow">
    <figcaption>The first reconstruction experiment</figcaption>
    <span className="research-status">Planned · controlled gaps in surviving texts</span>
    <ol className="reconstruction-steps">{steps.map(([number, title, detail]) => <li key={number}><span aria-hidden="true">{number}</span><strong>{title}</strong><small>{detail}</small></li>)}</ol>
    <p>Check training overlap before interpreting reconstruction scores.</p>
  </figure>;
}
