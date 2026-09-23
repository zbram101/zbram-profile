import React from 'react';
import ReactDOM from 'react-dom/client';
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react';
import { posts } from './blog';
import './blog.css';

function App() {
  return <main className="blog-shell blog-index">
    <header className="blog-header"><a href="/" className="blog-home"><ArrowLeft size={17}/> Portfolio home</a><a href="#top" className="blog-wordmark">br<span>.</span><small>FIELD NOTES</small></a></header>
    <section className="blog-hero" id="top"><p>FIELD NOTES / 2026</p><h1>Thoughts & <em>experience.</em></h1><span>What I’m building, what I’m testing, and what I’m learning along the way.</span></section>
    <section className="blog-articles" aria-labelledby="articles-heading">
      <div className="article-list-heading"><h2 id="articles-heading">Latest writing</h2><span>{posts.length} articles</span></div>
      <div className="article-list">{posts.map((post, index) => <article className="article-card" key={post.slug}>
        <a className="article-card-link" href={`/blog/${post.slug}/`} aria-labelledby={`title-${post.slug}`}>
          <div className="article-card-content">
            <div className="article-card-date">{index === 0 && <span className="latest-label">Latest</span>}<time>{post.date}</time></div>
            <h2 id={`title-${post.slug}`}>{post.title}</h2>
            <p className="article-excerpt">{post.excerpt}</p>
            <div className="article-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <div className="article-card-footer"><span className="article-read-time"><Clock3 size={15} aria-hidden="true"/>{post.readTime}</span><span className="read-article">Read article <ArrowUpRight size={17} aria-hidden="true"/></span></div>
          </div>
          <div className="article-card-image"><img src={post.hero} alt="" loading={index === 0 ? 'eager' : 'lazy'}/></div>
        </a>
      </article>)}</div>
    </section>
    <footer className="blog-footer"><a href="/">← Back to portfolio</a><a href="#top">Back to top ↑</a></footer>
  </main>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
