import { searchGithubRepositories, getGithubRepository } from './github.js';
import { getLinkedinProfile } from './linkedin.js';

export async function sourceGuide(message, fetcher = fetch) {
  if (/\blinked\s*in\b/i.test(message)) {
    const result = getLinkedinProfile();
    return { mode: 'profile', text: result.text || `You can view Bharadwaj’s [LinkedIn profile](${result.url}). The full profile hasn’t been imported here yet; I can answer career questions from his portfolio.`, cards: result.cards };
  }
  if (!/\b(github|repos?|repositories|repository)\b/i.test(message)) return null;
  if (/\bprivate\b/i.test(message)) return { mode: 'profile', text: 'This public assistant can read public GitHub repositories. Private repository content needs Bharadwaj’s approval before it can be shared here.', cards: [] };
  const named = message.match(/\b(?:repo|repository)\s+(?:called\s+|named\s+)?([a-zA-Z0-9_.-]+)/i)?.[1];
  if (named && !['on', 'for', 'about', 'with', 'that', 'is', 'are', 'please'].includes(named.toLowerCase())) {
    const result = await getGithubRepository(named.replace(/\.$/, ''), fetcher);
    const repo = result.repository;
    return { mode: 'profile', text: `${repo.name}${repo.fork ? ' is a fork' : ' is a public repository'} on Bharadwaj’s GitHub.${repo.language ? ` Its primary language is ${repo.language}.` : ''}${repo.description ? `\n\n${repo.description}` : ''}\n\nOpen the repository below to read its documentation.`, cards: result.cards };
  }
  const query = message.replace(/\b(show|tell|me|about|his|your|the|public|github|repos?|repositories|repository|projects|explore|find|what|are|on|has|he|built)\b/gi, '').trim();
  const result = await searchGithubRepositories(query, fetcher);
  return { mode: 'profile', text: result.repositories.length ? 'Here are relevant public repositories from Bharadwaj’s GitHub. Forks are labeled. Ask about a repository by name to explore it.' : 'I couldn’t find a matching public repository. Try a repository name or technology.', cards: result.cards };
}
