import { ArrowUpRight, CalendarDays, Clock3, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { posts } from '../blog';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!selectedPost) return undefined;
    const closeOnEscape = event => event.key === 'Escape' && setSelectedPost(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedPost]);

  return <>
    <div className="blog-grid">
      {posts.map(post => <article className="blog-card" key={post.slug}>
        <div className="blog-card-topline"><span>FIELD NOTES</span><span>{post.readTime}</span></div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="blog-meta"><span><CalendarDays size={14}/>{post.date}</span><span><Clock3 size={14}/>{post.readTime}</span></div>
        <div className="tag-row">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <button className="post-link" onClick={() => setSelectedPost(post)}>Read article <ArrowUpRight size={17}/></button>
      </article>)}
    </div>
    {selectedPost && <div className="post-dialog-backdrop" role="presentation" onMouseDown={() => setSelectedPost(null)}>
      <article className="post-dialog" role="dialog" aria-modal="true" aria-labelledby="post-title" onMouseDown={event => event.stopPropagation()}>
        <button className="post-close icon-button" onClick={() => setSelectedPost(null)} aria-label="Close article"><X size={20}/></button>
        <div className="eyebrow"><span className="little-line"/> FIELD NOTES</div>
        <h2 id="post-title">{selectedPost.title}</h2>
        <div className="blog-meta"><span><CalendarDays size={14}/>{selectedPost.date}</span><span><Clock3 size={14}/>{selectedPost.readTime}</span></div>
        <div className="post-content">{selectedPost.body.map(section => <section key={section.heading}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {section.callout && <aside>{section.callout}</aside>}
        </section>)}</div>
      </article>
    </div>}
  </>;
}
