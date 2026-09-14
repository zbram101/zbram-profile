import { executePortfolioTool } from './portfolio-tools.js';
import { agentConfiguration, validAgentId } from './agent-config.js';
import { githubCards } from './github.js';
import { CalendarError } from './google-calendar.js';

const encoder = new TextEncoder();
const base64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const unbase64 = value => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), character => character.charCodeAt(0));
const MAX_TURNS = 20;
const MAX_TOOLS = 12;
const MAX_TURN_SECONDS = 120;
export class ChatError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
async function signingKey(env) {
  // Domain separation keeps this signing use independent from provider authentication.
  return crypto.subtle.importKey('raw', encoder.encode(`portfolio-session-v1:${env.CHAT_SESSION_SECRET || env.OPENAI_API_KEY}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function signSession(claims, env) {
  const payload = base64(encoder.encode(JSON.stringify(claims)));
  const signature = await crypto.subtle.sign('HMAC', await signingKey(env), encoder.encode(payload));
  return `${payload}.${base64(signature)}`;
}
export async function readSession(token, env, allowExpired = false) {
  try {
    if (typeof token !== 'string' || token.length > 2000) throw new Error();
    const parts = token.split('.');
    if (parts.length !== 2 || !await crypto.subtle.verify('HMAC', await signingKey(env), unbase64(parts[1]), encoder.encode(parts[0]))) throw new Error();
    const claims = JSON.parse(new TextDecoder().decode(unbase64(parts[0])));
    if (claims.v !== 1 || !/^[a-zA-Z0-9_-]{1,200}$/.test(claims.id) || !Number.isFinite(claims.expires) || (!allowExpired && claims.expires <= Date.now())) throw new Error();
    return claims;
  } catch { throw new ChatError('This conversation has expired. Start a new conversation.', 401); }
}

function provider(env, fetcher) {
  // One deadline covers all provider requests made by an HTTP invocation.
  const signal = AbortSignal.timeout(18000);
  return async (path, body, { method = body ? 'POST' : 'GET', idempotencyKey, allowMissing = false } = {}) => {
    const response = await fetcher(`https://api.openai.com/v1/agents/sessions${path}`, {
      method, signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Beta': 'agents=v1', ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      if ((method === 'DELETE' || allowMissing) && response.status === 404) return null;
      throw new ChatError(response.status === 429 ? 'The assistant is busy. Please try again shortly.' : 'The agent connection needs attention. Please try again or connect through LinkedIn.', response.status === 429 ? 429 : 502);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };
}
const userInput = text => [{ role: 'user', content: [{ type: 'input_text', text }] }];
const validRequestId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{16,100}$/.test(value);
function validateMessage(body) {
  if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 8000 || !validRequestId(body.requestId)) throw new ChatError('Send a message of 1–8,000 characters with a valid request ID.');
}
const textOf = item => (item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n');

function cardsFrom(items, env) {
  const succeeded = new Map(items.filter(item => item.type === 'function_call_output' && item.status === 'completed' && !item.error).map(item => [item.call_id, item]));
  const cards = new Map();
  for (const item of items) {
    if (item.type !== 'function_call' || !succeeded.has(item.call_id)) continue;
    // Calendar results are already in the answer; never re-run availability
    // checks while reconstructing cards from a completed turn.
    if (item.name === 'find_meeting_times') continue;
    try {
      // Network tools use their saved results so polling does not fetch GitHub
      // again. Card URLs are rebuilt/validated against the fixed owner.
      const args = typeof item.arguments === 'string' ? JSON.parse(item.arguments) : item.arguments;
      let found;
      if (['search_github_repositories', 'get_github_repository'].includes(item.name)) {
        const output = succeeded.get(item.call_id).output;
        found = githubCards(typeof output === 'string' ? JSON.parse(output) : output);
      } else found = executePortfolioTool(item.name, args, env).cards || [];
      for (const card of found) cards.set(card.id, card);
    } catch { /* A failed/retired tool must not prevent reading a finished answer. */ }
  }
  return [...cards.values()].slice(-8);
}

export async function handleAgent(body, env, fetcher = fetch) {
  const api = provider(env, fetcher);
  if (body.action === 'create') {
    validateMessage(body);
    if (env.OPENAI_AGENT_ID && !validAgentId(env.OPENAI_AGENT_ID)) throw new ChatError('The saved agent configuration needs attention.', 502);
    // Conversation-only sessions require the first visitor message at creation.
    const session = await api('', {
      ...(env.OPENAI_AGENT_ID ? { agent_id: env.OPENAI_AGENT_ID } : { agent: agentConfiguration(env) }),
      environment: { type: 'none' }, metadata: { application: 'zbram-portfolio', version: '1' },
      input: userInput(body.message.trim()),
    });
    if (!session?.id || !/^[a-zA-Z0-9_-]{1,200}$/.test(session.id)) throw new ChatError('The agent could not start a conversation.', 502);
    return { mode: 'agent', sessionToken: await signSession({ v: 1, id: session.id, expires: Date.now() + 86400000, lastTurn: null }, env) };
  }
  const claims = await readSession(body.sessionToken, env, body.action === 'reset');
  const path = `/${encodeURIComponent(claims.id)}`;
  if (body.action === 'reset') {
    // The provider rejects deletion while a turn or tool request is active.
    const session = await api(path, undefined, { allowMissing: true });
    if (!session) return { mode: 'agent', deleted: true };
    if (!['idle', 'failed'].includes(session.status) || session.required_actions?.length) {
      await api(`${path}/events`, { events: [{ type: 'agent.session.input.cancel' }] });
      let stopped = false;
      for (let attempt = 0; attempt < 6; attempt++) {
        const current = await api(path);
        if (['idle', 'failed'].includes(current.status) && !current.required_actions?.length) { stopped = true; break; }
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      if (!stopped) throw new ChatError('The conversation is still stopping. Try Start over again.', 409);
    }
    await api(path, undefined, { method: 'DELETE' });
    return { mode: 'agent', deleted: true };
  }
  if (body.action === 'cancel') {
    await api(`${path}/events`, { events: [{ type: 'agent.session.input.cancel' }] });
    return { mode: 'agent', cancelled: true };
  }
  if (body.action === 'message') {
    validateMessage(body);
    const turns = await api(`${path}/turns?order=desc&limit=${MAX_TURNS + 1}`);
    if ((turns?.data?.length || 0) >= MAX_TURNS) throw new ChatError('This conversation has reached its limit. Start a new conversation.', 429);
    await api(`${path}/events`, { events: [{ type: 'agent.session.input.message', input: userInput(body.message.trim()) }] }, { idempotencyKey: `portfolio-message-${body.requestId}` });
    return { mode: 'agent', status: 'working', sessionToken: body.sessionToken };
  }
  if (body.action !== 'poll') throw new ChatError('Unsupported conversation action.');
  const [session, turnPage, itemPage] = await Promise.all([
    api(path), api(`${path}/turns?order=desc&limit=1`), api(`${path}/items?order=desc&limit=100`),
  ]);
  if (session?.status === 'failed') throw new ChatError('The agent could not complete this task. Start a new conversation.', 502);
  const turn = turnPage?.data?.[0];
  if (!turn || turn.id === claims.lastTurn) return { mode: 'agent', status: 'working', progress: 'Starting your request…', sessionToken: body.sessionToken };
  const items = (itemPage?.data || []).filter(item => item.turn_id === turn.id).reverse();
  const toolCalls = items.filter(item => item.type === 'function_call');
  const terminal = ['completed', 'cancelled', 'failed'].includes(turn.status);
  if (!terminal && (toolCalls.length > MAX_TOOLS || Date.now() / 1000 - turn.created_at > MAX_TURN_SECONDS || (session.usage?.total_tokens || 0) > 60000)) {
    await api(`${path}/events`, { events: [{ type: 'agent.session.input.cancel' }] });
    throw new ChatError('This task reached its limit. Try a narrower question or start a new conversation.', 429);
  }
  if (turn.status === 'failed' || turn.status === 'cancelled') return {
    mode: 'agent', status: 'complete', sessionToken: await signSession({ ...claims, lastTurn: turn.id }, env),
    text: turn.status === 'cancelled' ? 'Stopped. No meeting was booked or message sent.' : 'I couldn’t finish that request. Please try a narrower question.', cards: [],
  };
  const pending = (session.required_actions || []).filter(action => action.type === 'function_call' && action.turn_id === turn.id);
  if (pending.length && !terminal) {
    if (pending.length > MAX_TOOLS) throw new ChatError('The task requested too many actions.', 429);
    const events = await Promise.all(pending.map(async action => {
      const result = { type: 'agent.session.input.tool_result', turn_id: action.turn_id, call_id: action.call_id };
      try { return { ...result, success: true, output: JSON.stringify(await executePortfolioTool(action.name, action.arguments, env, fetcher)) }; }
      catch (error) { return { ...result, success: false, error: error instanceof CalendarError ? error.message : 'This tool or its arguments are unavailable. Ask the visitor for the missing information or use an approved tool.' }; }
    }));
    // Deterministic idempotency makes overlapping polls safe for read/draft tools.
    const digest = base64(await crypto.subtle.digest('SHA-256', encoder.encode(pending.map(action => action.call_id).sort().join('|'))));
    await api(`${path}/events`, { events }, { idempotencyKey: `portfolio-tools-${digest}` });
  }
  const cards = cardsFrom(items, env);
  if (turn.status === 'completed') {
    const text = items.filter(item => item.type === 'message' && item.role === 'assistant' && item.status === 'completed' && item.phase !== 'commentary').map(textOf).join('\n\n').trim();
    if (!text) throw new ChatError('The agent returned no answer. Start a new conversation and try again.', 502);
    return { mode: 'agent', status: 'complete', text, cards, sessionToken: await signSession({ ...claims, lastTurn: turn.id }, env) };
  }
  const name = pending[0]?.name || toolCalls.at(-1)?.name;
  const progress = name?.includes('meeting') || name?.includes('scheduling') ? 'Preparing the next step for your conversation…' : name?.includes('github') ? 'Reading public GitHub repositories…' : name ? 'Finding relevant work and sources…' : 'Working on your request…';
  return { mode: 'agent', status: 'working', progress, cards, sessionToken: body.sessionToken };
}
