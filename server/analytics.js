import { posts } from '../src/blog.js';

const site = 'https://bharadwajramachandran.com';
const canonicalPage = value => typeof value === 'string' ? value.replace(/\/?$/, '/') : '';
const normalizeTarget = value => {
  if (typeof value !== 'string' || value.length > 2048) return null;
  if (value === '#top') return value;
  try {
    const url = new URL(value, site);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    return url.origin === site ? url.pathname : `${url.origin}${url.pathname}`;
  } catch { return null; }
};
const navigation = [['/', 'Portfolio home'], ['/blog/', 'All articles'], ['#top', 'Back to top']];
const pages = new Map([['/', { title: 'Portfolio', links: new Map(navigation) }], ['/blog/', {
  title: 'Blog index', links: new Map([...navigation, ...posts.map(post => [`/blog/${post.slug}/`, post.title])]),
}]]);
for (const post of posts) {
  const links = new Map(navigation);
  const add = (target, label) => { const normalized = normalizeTarget(target); if (normalized) links.set(normalized, label); };
  for (const source of post.sources) add(source.url, source.label);
  for (const section of post.body) {
    for (const reference of section.references || []) add(reference.url, reference.label);
    for (const row of section.table?.rows || []) {
      for (const cell of row) if (typeof cell === 'object') add(cell.href, cell.text);
    }
  }
  pages.set(`/blog/${post.slug}/`, { title: post.title, slug: post.slug, links });
}

// Only published pages and their known links can become log fields or metric dimensions.
export function parseAnalyticsEvent(body) {
  const visitorId = body?.visitorId;
  const type = body?.type ?? 'page_view'; // Preserve the deployed profile client's contract.
  const page = canonicalPage(body?.path);
  const entry = pages.get(page);
  if (typeof visitorId !== 'string' || !/^[a-f0-9-]{16,64}$/i.test(visitorId) || !entry || !['page_view', 'link_click'].includes(type)) return null;
  const details = { EventType: type, Page: page, PageTitle: entry.title, ...(entry.slug ? { ArticleSlug: entry.slug, ArticleTitle: entry.title } : {}) };
  if (type === 'link_click') {
    const target = normalizeTarget(body.target);
    const label = entry.links.get(target);
    if (!label) return null;
    Object.assign(details, { LinkTarget: target, LinkLabel: label, LinkType: target.startsWith('http') ? 'external' : target.startsWith('/evidence/') ? 'evidence' : 'navigation' });
  }
  return { visitorId, type, page, isBlog: page.startsWith('/blog/'), isArticle: Boolean(entry.slug), details };
}
