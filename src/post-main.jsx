import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowLeft, ArrowUp, CalendarDays, Clock3 } from 'lucide-react';
import { posts } from './blog';
import './blog.css';

const benchmarks = [
  { name: 'AutomationBench', astra: 41.4, sol: 18.1 },
  { name: 'Terminal-Bench 4.0', astra: 57.9, sol: 37.3 },
  { name: 'FrontierMath Tier 4', astra: 97.6, sol: 83.0 },
  { name: 'ARC-AGI-3', astra: 99.9, sol: 7.8 },
  { name: 'MRCR v2 · 512K–1M', astra: 96.3, sol: 73.8 }
];

function BenchmarkChart() {
  return <figure className="diagram benchmark-chart" aria-label="Published benchmark comparison between GPT-6 Astra and GPT-5.6 Sol">
    <figcaption>A broad jump, not a single-score story</figcaption>
    <div className="chart-legend"><span><i className="legend-swatch astra"/>GPT-6 Astra</span><span><i className="legend-swatch sol"/>GPT-5.6 Sol</span></div>
    <div className="benchmark-scale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
    <div className="benchmark-rows">{benchmarks.map(item => <div className="benchmark-row" key={item.name}>
      <strong>{item.name}</strong>
      <div className="benchmark-bars">
        <span className="benchmark-bar astra" style={{ width: `${item.astra}%` }}><b>{item.astra}</b></span>
        <span className="benchmark-bar sol" style={{ width: `${item.sol}%` }}><b>{item.sol}</b></span>
      </div>
    </div>)}</div>
    <p>Scores use different benchmark methods and should be read within each row—not averaged across tasks.</p>
  </figure>;
}

function RecurrentLens() {
  return <figure className="diagram recurrent-diagram">
    <figcaption>Repeated work at the system level</figcaption>
    <div className="diagram-note">Conceptual lens · not a claim about undisclosed model architecture</div>
    <div className="diagram-flow recurrent-flow"><span>Context</span><i>→</i><span>Reason</span><i>→</i><span>Act</span><i>→</i><span>Observe</span><i>↻</i></div>
    <p>Persist state, incorporate results, steer, and repeat until the outcome is ready for review.</p>
  </figure>;
}

function ContextDiagram() {
  return <figure className="diagram c4-diagram">
    <figcaption>System context · C4 level 1</figcaption>
    <div className="diagram-note">Public conceptual view</div>
    <div className="c4-context">
      <div className="c4-node c4-person"><small>PERSON</small><strong>Player</strong><span>Builds and owns a tactical identity</span></div>
      <div className="c4-relation"><span>creates profiles + loadouts</span><i>→</i></div>
      <div className="c4-node c4-system"><small>SOFTWARE SYSTEM</small><strong>goLoadout</strong><span>Shapes identity, loadouts, and sharing</span></div>
      <div className="c4-relation"><span>shares selected content</span><i>→</i></div>
      <div className="c4-node c4-external"><small>EXTERNAL SYSTEM</small><strong>Community spaces</strong><span>Where players intentionally connect</span></div>
    </div>
    <div className="diagram-key"><span><i className="key-person"/>Person</span><span><i className="key-system"/>goLoadout</span><span><i className="key-external"/>External system</span></div>
  </figure>;
}

function ContainerDiagram() {
  return <figure className="diagram c4-diagram">
    <figcaption>Container responsibilities · C4 level 2</figcaption>
    <div className="diagram-note">Logical boundaries only · implementation details intentionally omitted</div>
    <div className="container-flow">
      <div className="c4-node container-node"><small>EXPERIENCE CONTAINER</small><strong>Player experience</strong><span>Profiles, loadouts, preview</span></div>
      <div className="c4-relation"><span>uses product capabilities</span><i>→</i></div>
      <div className="c4-node container-node"><small>APPLICATION CONTAINER</small><strong>Identity & loadout service</strong><span>Product rules and player-owned records</span></div>
      <div className="c4-relation"><span>requests explicit sharing</span><i>→</i></div>
      <div className="c4-node container-node"><small>APPLICATION CONTAINER</small><strong>Publishing service</strong><span>Controlled sharing workflow</span></div>
    </div>
    <div className="container-data">
      <div className="c4-node container-node"><small>DATA CONTAINER</small><strong>Product data</strong><span>Profiles and loadouts</span></div>
      <div className="c4-relation"><span>references selected assets</span><i>→</i></div>
      <div className="c4-node container-node"><small>DATA CONTAINER</small><strong>Media store</strong><span>Player-selected assets</span></div>
    </div>
    <p>The experience coordinates the journey; focused services own product behavior; data containers preserve the player’s work.</p>
  </figure>;
}

function DynamicDiagram() {
  const steps = [
    ['01', 'Profile', 'Establish the player identity'],
    ['02', 'Loadout', 'Assemble the useful setup'],
    ['03', 'Preview', 'Choose what becomes visible'],
    ['04', 'Publish', 'Share to a community touchpoint']
  ];
  return <figure className="diagram dynamic-diagram">
    <figcaption>Core journey · C4 dynamic view</figcaption>
    <div className="dynamic-steps">{steps.map(([number, name, description]) => <div className="dynamic-step" key={number}><b>{number}</b><strong>{name}</strong><span>{description}</span></div>)}</div>
    <p>The numbered sequence shows collaboration over time, while keeping operational details private.</p>
  </figure>;
}

function Diagram({ type }) {
  if (type === 'astra-benchmarks') return <BenchmarkChart />;
  if (type === 'recurrent-lens') return <RecurrentLens />;
  if (type === 'goloadout-context') return <ContextDiagram />;
  if (type === 'goloadout-containers') return <ContainerDiagram />;
  if (type === 'goloadout-dynamic') return <DynamicDiagram />;
  return null;
}

function App() {
  const slug = document.body.dataset.post;
  const post = posts.find(item => item.slug === slug);

  if (!post) return <main className="blog-shell"><header className="blog-header"><a href="/blog/" className="blog-home"><ArrowLeft size={17}/> All articles</a></header><section className="blog-hero"><h1>Article not<br/><em>found.</em></h1></section></main>;

  return <main className="blog-shell">
    <header className="blog-header"><a href="/blog/" className="blog-home"><ArrowLeft size={17}/> All articles</a><a href="/" className="blog-wordmark">br<span>.</span><small>FIELD NOTES</small></a></header>
    <article className="article post-page" id="top">
      <div className="article-kicker"><span>FIELD NOTES</span><span>{post.readTime}</span></div>
      <h1>{post.title}</h1>
      <p className="article-excerpt">{post.excerpt}</p>
      <div className="article-meta"><span><CalendarDays size={15}/>{post.date}</span><span><Clock3 size={15}/>{post.readTime}</span></div>
      <div className="article-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <figure className="article-hero"><img src={post.hero} alt={post.heroAlt}/></figure>
      <div className="article-body">{post.body.map(section => <section key={section.heading}>
        <h2>{section.heading}</h2>
        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.diagram && <Diagram type={section.diagram}/>}
        {section.callout && <aside>{section.callout}</aside>}
      </section>)}</div>
      <section className="article-sources"><p>SOURCES & FURTHER READING</p><ol>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ol></section>
    </article>
    <footer className="blog-footer"><a href="/blog/">← All articles</a><a href="#top">Back to top <ArrowUp size={15}/></a></footer>
  </main>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
