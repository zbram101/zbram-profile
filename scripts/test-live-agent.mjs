// Opt-in live smoke test. Uses the local key, makes paid API calls, and deletes
// its own temporary session. Never run as part of the offline npm test suite.
import { loadEnv } from 'vite';
import { webcrypto, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { handleChat } from '../server/chat.js';
import { signSession } from '../server/agent.js';

globalThis.crypto ||= webcrypto;
const env = { ...loadEnv('development', process.cwd(), ''), ...process.env };
if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured.');
const savedOnly = process.argv.includes('--saved-agent-only');
const calendarOnly = process.argv.includes('--calendar-only');
if ((savedOnly || calendarOnly) && !env.OPENAI_AGENT_ID) throw new Error('OPENAI_AGENT_ID is required for the saved-agent test.');
if (calendarOnly && (!env.GOOGLE_REFRESH_TOKEN || !env.GOOGLE_CALENDAR_RULES)) throw new Error('Authorize Google Calendar and configure approved meeting hours first.');
const redact = value => String(value || '').replaceAll(env.OPENAI_API_KEY, '[REDACTED]').replace(/sk-[a-zA-Z0-9_*.-]+/g, '[REDACTED]').slice(0, 1000);
const seenTools = new Set();
const toolNames = new Map();
const calendarResults = [];
const providerSessions = new Set();
const firstQuestion = 'Find Bharadwaj’s documented RAG work at Thermo Fisher. Please use the portfolio tools and show the source.';
let sessionToken;
const fetcher = async (url, options = {}) => {
  if ((savedOnly || calendarOnly) && new URL(url).pathname === '/v1/agents/sessions' && options.method === 'POST') {
    const body = JSON.parse(options.body);
    assert.equal(body.agent_id, env.OPENAI_AGENT_ID);
    assert.equal(body.agent, undefined);
  }
  if (calendarOnly && new URL(url).hostname === 'api.openai.com' && new URL(url).pathname.endsWith('/events') && options.body) {
    for (const event of JSON.parse(options.body).events || []) {
      if (event.type === 'agent.session.input.tool_result' && toolNames.get(event.call_id) === 'find_meeting_times') {
        assert.equal(event.success, true, 'Live Calendar lookup must succeed');
        const output = JSON.parse(event.output);
        assert.ok(['available', 'no_slots'].includes(output.status));
        assert.ok(Object.keys(output).every(key => ['status', 'checkedAt', 'slots', 'rules', 'note'].includes(key)));
        for (const slot of output.slots) assert.deepEqual(Object.keys(slot).sort(), ['end', 'label', 'start', 'timezone']);
        calendarResults.push({ status: output.status, slotCount: output.slots.length });
      }
    }
  }
  const response = await fetch(url, options);
  if (new URL(url).hostname === 'api.openai.com') {
    const data = await response.clone().json().catch(() => null);
    if (!response.ok) console.log(JSON.stringify({ providerStatus: response.status, code: data?.error?.code, parameter: data?.error?.param, message: redact(data?.error?.message) }));
    if (new URL(url).pathname === '/v1/agents/sessions' && response.ok && data?.id) providerSessions.add(data.id);
    for (const action of data?.required_actions || []) {
      if (action.type === 'function_call' && !seenTools.has(action.call_id)) {
        seenTools.add(action.call_id);
        toolNames.set(action.call_id, action.name);
        console.log(JSON.stringify({ tool: action.name }));
      }
    }
  }
  return response;
};
const call = async body => {
  const response = await handleChat(new Request('https://portfolio.test/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }), env, fetcher);
  const data = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${data.error}`);
  if (data.sessionToken) sessionToken = data.sessionToken;
  return data;
};
async function ask(message) {
  const request = { action: sessionToken ? 'message' : 'create', message, sessionToken, requestId: randomUUID() };
  await call(request);
  if (request.action === 'create') {
    console.log('Live agent session created.');
  } else {
    await call(request);
    console.log('Repeated message request submitted with the same idempotency key.');
  }
  const deadline = Date.now() + 135000;
  while (Date.now() < deadline) {
    const data = await call({ action: 'poll', sessionToken });
    if (data.status === 'complete') {
      console.log(JSON.stringify({ status: data.status, text: redact(data.text), cards: data.cards?.map(card => ({ type: card.type, id: card.id })) }));
      return data;
    }
    await new Promise(resolve => setTimeout(resolve, 1800));
  }
  throw new Error('Live test timed out.');
}
try {
  if (process.argv.includes('--cleanup-previous')) {
    const options = { headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Beta': 'agents=v1' }, signal: AbortSignal.timeout(18000) };
    const response = await fetcher('https://api.openai.com/v1/agents/sessions?limit=100&order=desc', options);
    if (!response.ok) throw new Error('Could not list recent test sessions.');
    const page = await response.json();
    for (const session of page.data || []) {
      if (session.metadata?.application !== 'zbram-portfolio' || Date.now() / 1000 - session.created_at > 3600) continue;
      const itemsResponse = await fetcher(`https://api.openai.com/v1/agents/sessions/${encodeURIComponent(session.id)}/items?limit=100`, options);
      if (!itemsResponse.ok) continue;
      const items = (await itemsResponse.json()).data || [];
      const messages = items.filter(item => item.role === 'user');
      if (messages.length === 1 && messages[0].content?.some(part => part.text === firstQuestion)) {
        providerSessions.add(session.id);
      }
    }
    console.log(`Found ${providerSessions.size} matching temporary smoke-test sessions for cleanup.`);
  } else if (calendarOnly) {
    await ask('I would like to discuss AI collaboration with Bharadwaj. My time zone is America/Los_Angeles. Please check his live calendar and suggest up to three available 30-minute times in the next seven days.');
    assert.ok(calendarResults.length > 0, 'The saved agent must use the live Calendar tool');
    console.log(JSON.stringify({ calendar: calendarResults }));
    console.log('PASS: saved agent checks real Google availability through the chat handler without exposing private event details.');
  } else {
    const portfolio = await ask(firstQuestion);
    assert.ok(portfolio.cards?.some(card => card.kind === 'Experience'), 'Expected a portfolio source card.');
    if (savedOnly) {
      console.log('PASS: saved OpenAI agent answers through the website handler and executes portfolio tools.');
    } else {
      const github = await ask('Read the README of my public GitHub repository zbram-profile using the GitHub tool. Give one brief fact from it.');
      assert.ok(github.cards?.some(card => card.id === 'github-zbram-profile'), 'Expected a GitHub source card.');
      const meeting = await ask('I’d like to discuss an AI collaboration with Bharadwaj. My time zone is America/Los_Angeles. I’m flexible about dates. Please prepare a meeting request in this conversation.');
      assert.ok(meeting.cards?.some(card => card.type === 'meeting'), 'Expected an unsent meeting draft.');
      console.log('PASS: real agent answers, portfolio/GitHub tools, and a conversational meeting draft.');
    }
  }
} catch (error) {
  console.error(redact(error.message));
  process.exitCode = 1;
} finally {
  for (const providerSession of providerSessions) {
    if (!/^[a-zA-Z0-9_-]{1,200}$/.test(providerSession)) continue;
    try {
      const token = await signSession({ v: 1, id: providerSession, expires: Date.now() + 60000, lastTurn: null }, env);
      await call({ action: 'reset', sessionToken: token });
      console.log('Temporary live-test session deleted.');
    } catch (error) { console.error(redact(error.message)); process.exitCode = 1; }
  }
}
