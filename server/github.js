import { profile } from '../src/profile.js';

export const githubOwner = new URL(profile.github).pathname.split('/').filter(Boolean)[0];
const root = `https://api.github.com`;
const validRepo = name => typeof name === 'string' && /^[a-zA-Z0-9_.-]{1,100}$/.test(name) && !['.', '..'].includes(name);
const canonicalUrl = name => `https://github.com/${githubOwner}/${name}`;
const caches = new WeakMap();
const TTL = 60000;

function publicRecord(data) {
  if (!data || data.private !== false || data.visibility && data.visibility !== 'public'
    || data.owner?.login?.toLowerCase() !== githubOwner.toLowerCase() || !validRepo(data.name)
    || data.full_name?.toLowerCase() !== `${githubOwner}/${data.name}`.toLowerCase()) return null;
  return {
    name: data.name, url: canonicalUrl(data.name), description: String(data.description || '').slice(0, 1000),
    language: typeof data.language === 'string' ? data.language.slice(0, 80) : null,
    topics: Array.isArray(data.topics) ? data.topics.filter(topic => typeof topic === 'string').slice(0, 15) : [],
    fork: data.fork === true, archived: data.archived === true,
    pushedAt: data.pushed_at || null, visibility: 'public',
  };
}

async function requestJson(path, fetcher, signal) {
  // Deliberately unauthenticated: a server credential must never make private
  // repositories readable by an anonymous portfolio visitor.
  const response = await fetcher(`${root}${path}`, {
    method: 'GET', redirect: 'error', signal,
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'zbram-portfolio', 'X-GitHub-Api-Version': '2026-03-10' },
  });
  if (response.status === 404) return null;
  if (response.status === 403 || response.status === 429) throw new Error('GitHub has reached its request limit. Please try again later.');
  if (!response.ok) throw new Error('GitHub is temporarily unavailable.');
  const reader = response.body?.getReader();
  if (!reader) throw new Error('GitHub returned an empty response.');
  const chunks = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1000000) { await reader.cancel(); throw new Error('This GitHub response is too large to read.'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function cached(key, fetcher, read) {
  let cache = caches.get(fetcher);
  if (!cache) { cache = new Map(); caches.set(fetcher, cache); }
  const previous = cache.get(key);
  if (previous?.expires > Date.now()) return previous.promise;
  // Bounded memory and coalesced concurrent requests in each server instance.
  if (cache.size >= 50) cache.delete(cache.keys().next().value);
  const entry = { expires: Date.now() + TTL };
  entry.promise = read().catch(error => { if (cache.get(key) === entry) cache.delete(key); throw error; });
  cache.set(key, entry);
  return entry.promise;
}

export function githubCards(result) {
  const records = result?.repositories || (result?.repository ? [result.repository] : []);
  if (!Array.isArray(records)) return [];
  return records.filter(record => record?.visibility === 'public' && validRepo(record.name) && record.url === canonicalUrl(record.name)).slice(0, 5).map(record => ({
    type: 'source', id: `github-${record.name}`, kind: record.fork ? 'GitHub · Fork' : 'GitHub',
    title: record.name, url: canonicalUrl(record.name), summary: typeof record.description === 'string' ? record.description.slice(0, 500) : '',
  }));
}

export async function searchGithubRepositories(query, fetcher = fetch) {
  const catalog = await cached('catalog', fetcher, async () => {
    const signal = AbortSignal.timeout(8000);
    const repositories = []; let hasMore = false;
    for (let page = 1; page <= 3; page++) {
      const data = await requestJson(`/users/${githubOwner}/repos?type=owner&sort=updated&per_page=100&page=${page}`, fetcher, signal);
      if (!Array.isArray(data)) throw new Error('GitHub returned an invalid repository list.');
      repositories.push(...data.map(publicRecord).filter(Boolean));
      hasMore = data.length === 100;
      if (!hasMore) break;
    }
    return { repositories, hasMore, fetchedAt: new Date().toISOString() };
  });
  const words = [...new Set(query.toLowerCase().match(/[a-z0-9]+/g) || [])].filter(word => !['github', 'repo', 'repos', 'repositories', 'his', 'show', 'me', 'all', githubOwner.toLowerCase()].includes(word));
  const repositories = catalog.repositories.map(repository => ({ repository, score: words.reduce((score, word) => score + (JSON.stringify(repository).toLowerCase().includes(word) ? 1 : 0), 0) }))
    .filter(item => !words.length || item.score > 0).sort((a, b) => b.score - a.score || Number(a.repository.fork) - Number(b.repository.fork)).slice(0, 5).map(item => item.repository);
  const result = { owner: githubOwner, repositories, fetchedAt: catalog.fetchedAt, hasMore: catalog.hasMore, scope: 'public_repositories_only', note: 'Repository presence, forks, and README claims do not establish personal authorship or production status.' };
  return { ...result, cards: githubCards(result) };
}

export async function getGithubRepository(name, fetcher = fetch) {
  if (!validRepo(name)) throw new Error('Use a repository name from the GitHub search results.');
  const result = await cached(`repo:${name.toLowerCase()}`, fetcher, async () => {
    const signal = AbortSignal.timeout(8000);
    const path = `/repos/${githubOwner}/${encodeURIComponent(name)}`;
    const repository = publicRecord(await requestJson(path, fetcher, signal));
    if (!repository) throw new Error('This repository is not available to the public portfolio assistant.');
    const file = await requestJson(`${path}/readme`, fetcher, signal);
    let readme = null;
    if (file?.encoding === 'base64' && typeof file.content === 'string' && file.size <= 100000) {
      try { readme = new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, '')), c => c.charCodeAt(0))).slice(0, 12000); }
      catch { /* An absent or unsupported README leaves useful metadata available. */ }
    }
    return { repository, readme, readmeStatus: readme == null ? 'unavailable' : 'available', readmeTruncated: readme != null && new TextEncoder().encode(readme).length < file.size, fetchedAt: new Date().toISOString(), scope: 'public_repositories_only' };
  });
  return { ...result, cards: githubCards(result) };
}
