const chatApiUrl = import.meta.env.VITE_CHAT_API_URL?.trim() || 'https://zho73b11v5.execute-api.us-east-1.amazonaws.com/chat';

export { chatApiUrl };
export const analyticsApiUrl = chatApiUrl.replace(/\/chat$/, '/event');

export function recordVisit() {
  if (!window.crypto?.randomUUID) return;
  const storageKey = 'br-portfolio-visitor';
  let visitorId = localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId = window.crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }
  fetch(analyticsApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, path: window.location.pathname }),
    keepalive: true,
  }).catch(() => {});
}
