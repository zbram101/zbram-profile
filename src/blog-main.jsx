import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react';
import { posts } from './blog';
import './blog.css';

function App() {
  return <main className="blog-shell">
    <header className="blog-header"><a href="/" className="blog-home"><ArrowLeft size={17}/> Portfolio home</a><a href="#top" className="blog-wordmark">br<span>.</span><small>FIELD NOTES</small></a></header>
    <section className="blog-hero" id="top"><p>FIELD NOTES / 2026</p><h1>Notes from<br/><em>the build.</em></h1><span>Product thinking, architecture, and the decisions behind the work.</span></section>
    <section className="article-list" aria-label="Articles">{posts.map((post, index) => <article className="article-card" key={post.slug}>
      <div className="article-kicker"><span>ARTICLE {String(index + 1).padStart(2, '0')}</span><span>{post.readTime}</span></div>
      <h2>{post.title}</h2><p className="article-excerpt">{post.excerpt}</p>
      <div className="article-meta"><span><CalendarDays size={15}/>{post.date}</span><span><Clock3 size={15}/>{post.readTime}</span></div>
      <div className="article-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <a className="read-article" href={`/blog/${post.slug}/`}>Read article <ArrowUpRight size={17}/></a>
    </article>)}</section>
    <footer className="blog-footer"><a href="/">← Back to portfolio</a><a href="#top">Back to top ↑</a></footer>
  </main>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
