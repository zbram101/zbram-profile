import { createPageAnalytics } from './analytics-client.js';

const chatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim() || (import.meta.env.DEV ? '/api/chat' : 'https://zho73b11v5.execute-api.us-east-1.amazonaws.com/chat');

export { chatApiUrl };
export const analyticsApiUrl = chatApiUrl.replace(/\/chat$/, '/event');

const analytics = createPageAnalytics({
  window,
  document,
  enabled: !import.meta.env.DEV && !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname),
  send: event => fetch(analyticsApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }),
});

export const recordVisit = analytics.recordVisit;
export const startPageAnalytics = analytics.start;
