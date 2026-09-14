// Owner-only setup: save the portfolio configuration in the current OpenAI
// project. Existing agents are reused; --update explicitly replaces their config.
import { loadEnv } from 'vite';
import { readFile, writeFile, rename, chmod } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { agentConfiguration, portfolioAgentName, validAgentId } from '../server/agent-config.js';

const env = { ...loadEnv('development', process.cwd(), ''), ...process.env };
const application = 'zbram-portfolio';
if (!env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured.');
if (process.argv.slice(2).some(arg => arg !== '--update')) throw new Error('Only --update is supported.');
async function api(path, body) {
  const response = await fetch(`https://api.openai.com/v1/agents${path}`, {
    method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(18000),
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'OpenAI-Beta': 'agents=v1', 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error(`OpenAI agent setup failed (HTTP ${response.status}). No automatic retry was made.`);
  return response.json();
}
async function saveId(id) {
  if (!validAgentId(id)) throw new Error('OpenAI returned an invalid agent ID.');
  const path = '.env.local';
  const existing = await readFile(path, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error; });
  const lines = existing.split(/\r?\n/).filter(line => !/^\s*(?:export\s+)?OPENAI_AGENT_ID\s*=/.test(line));
  const temporary = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${lines.join('\n').trimEnd()}\nOPENAI_AGENT_ID=${id}\n`, { mode: 0o600, flag: 'wx' });
  await rename(temporary, path);
  await chmod(path, 0o600);
}
try {
  let saved;
  if (env.OPENAI_AGENT_ID) {
    if (!validAgentId(env.OPENAI_AGENT_ID)) throw new Error('OPENAI_AGENT_ID is invalid.');
    saved = await api(`/${env.OPENAI_AGENT_ID}`);
    if (saved.metadata?.application !== application) throw new Error('Configured agent is not marked as this portfolio. Refusing to replace it.');
  } else {
    // Fail closed on pagination rather than risk creating a duplicate.
    const page = await api('?limit=100');
    if (page.has_more) throw new Error('Set OPENAI_AGENT_ID explicitly; the agent list exceeds one page.');
    const matches = (page.data || []).filter(agent => agent.metadata?.application === application);
    if (matches.length > 1) throw new Error('Multiple portfolio agents exist. Set OPENAI_AGENT_ID explicitly.');
    saved = matches[0];
  }
  const config = { name: portfolioAgentName, ...agentConfiguration(env), metadata: { application, version: '1' } };
  let action = 'reused';
  if (!saved) { saved = await api('', config); action = 'created'; }
  // Record the ID before follow-up verification, so a failed GET cannot lead
  // to another creation. An uncertain POST must be reconciled by listing first.
  await saveId(saved.id);
  if (action !== 'created' && process.argv.includes('--update')) {
    saved = await api(`/${saved.id}`, config); action = 'updated';
  }
  const verified = await api(`/${saved.id}`);
  if (verified.id !== saved.id || verified.metadata?.application !== application) throw new Error('Saved agent verification failed.');
  console.log(JSON.stringify({ action, id: verified.id, name: verified.name, model: verified.model, tools: verified.tools?.map(tool => tool.name), localConfigurationSaved: true }));
} catch (error) {
  // Never print HTTP response bodies, headers, credentials, or environment data.
  console.error(error instanceof Error && error.message.startsWith('OpenAI agent setup') ? error.message : error instanceof Error && !error.cause ? error.message : 'Agent setup could not finish. Check connectivity and reconcile saved agents before retrying.');
  process.exitCode = 1;
}
