import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowLeft, ArrowUp, CalendarDays, Clock3 } from 'lucide-react';
import { posts } from './blog';
import './blog.css';

function Diagram({ type }) {
  if (type === 'astra') return <figure className="diagram rollout-diagram"><figcaption>Astra’s rollout feedback loop</figcaption><div className="diagram-flow"><span>Release</span><i>→</i><span>Observe</span><i>→</i><span>Learn</span><i>→</i><span>Improve</span></div><p>Signals: activation · task completion · repeat use · reliability</p></figure>;
  if (type === 'astra-architecture') return <figure className="diagram architecture-diagram"><figcaption>Astra’s layered architecture</figcaption><div className="layer-stack"><span>Experience<br/><small>focused interface</small></span><span>Workflows<br/><small>explicit actions</small></span><span>Shared services<br/><small>identity · data · integrations</small></span><span>Operations<br/><small>telemetry · controls · safeguards</small></span></div></figure>;
  if (type === 'goloadout-loop') return <figure className="diagram loop-diagram"><figcaption>The goLoadout core loop</figcaption><div className="diagram-flow"><span>Identity</span><i>→</i><span>Loadout</span><i>→</i><span>Share</span><i>→</i><span>Connection</span></div><p>Each step is useful alone and stronger together.</p></figure>;
  return <figure className="diagram architecture-diagram"><figcaption>goLoadout’s system map</figcaption><div className="layer-stack"><span>Player experience<br/><small>profile · visual identity</small></span><span>Domain model<br/><small>profiles · loadouts · rules</small></span><span>Sharing layer<br/><small>community touchpoints</small></span><span>Platform services<br/><small>permissions · data · integrations</small></span></div></figure>;
}

function App() {
  return <main className="blog-shell">
    <header className="blog-header"><a href="/" className="blog-home"><ArrowLeft size={17}/> Portfolio home</a><a href="#top" className="blog-wordmark">br<span>.</span><small>FIELD NOTES</small></a></header>
    <section className="blog-hero" id="top"><p>FIELD NOTES / 2026</p><h1>Notes from<br/><em>the build.</em></h1><span>Product thinking, architecture, and the decisions behind the work.</span></section>
    <nav className="article-nav" aria-label="Articles">{posts.map((post, index) => <a href={`#${post.slug}`} key={post.slug}><b>{String(index + 1).padStart(2, '0')}</b> {post.title}</a>)}</nav>
    {posts.map((post, index) => <article className="article" id={post.slug} key={post.slug}>
      <div className="article-kicker"><span>ARTICLE {String(index + 1).padStart(2, '0')}</span><span>{post.readTime}</span></div>
      <h2>{post.title}</h2><p className="article-excerpt">{post.excerpt}</p>
      <div className="article-meta"><span><CalendarDays size={15}/>{post.date}</span><span><Clock3 size={15}/>{post.readTime}</span></div>
      <div className="article-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="article-body">{post.body.map(section => <section key={section.heading}><h3>{section.heading}</h3>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.diagram && <Diagram type={section.diagram}/>} {section.callout && <aside>{section.callout}</aside>}</section>)}</div>
    </article>)}
    <footer className="blog-footer"><a href="/">← Back to portfolio</a><a href="#top">Back to top <ArrowUp size={15}/></a></footer>
  </main>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
