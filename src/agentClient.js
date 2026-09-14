export async function chatRequest(url, body, signal) {
  const request = new AbortController();
  const abort = () => request.abort(signal.reason);
  if (signal.aborted) abort();
  else signal.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => request.abort(new DOMException('The request timed out. Retry to continue.', 'TimeoutError')), 22000);
  try {
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: request.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'The assistant is temporarily unavailable.');
    return data;
  } finally { clearTimeout(timeout); signal.removeEventListener('abort', abort); }
}
function delay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Stopped', 'AbortError'));
    const stop = () => { clearTimeout(timer); reject(new DOMException('Stopped', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', stop); resolve(); }, milliseconds);
    signal.addEventListener('abort', stop, { once: true });
  });
}
export async function pollAgent({ url, sessionToken, signal, onProgress }) {
  const deadline = Date.now() + 125000;
  while (Date.now() < deadline) {
    const data = await chatRequest(url, { action: 'poll', sessionToken }, signal);
    if (data.status === 'complete') return data;
    onProgress(data);
    await delay(1800, signal);
  }
  await chatRequest(url, { action: 'cancel', sessionToken }, signal);
  throw new Error('This request took too long and was stopped. Start a new conversation to try again.');
}
