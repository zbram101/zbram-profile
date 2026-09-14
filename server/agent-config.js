import { agentInstructions, portfolioTools } from './portfolio-tools.js';

export const portfolioAgentName = 'Bharadwaj Portfolio Agent';
export const validAgentId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(value);
export const agentConfiguration = (env = {}) => ({
  model: env.OPENAI_AGENT_MODEL || 'gpt-6-astra',
  instructions: agentInstructions,
  tools: portfolioTools,
  multi_agent: { enabled: false },
  text: { verbosity: 'low' },
});
