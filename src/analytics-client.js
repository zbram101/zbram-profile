// One instance per document: React effect replays must not double-count a view.
export function createPageAnalytics({ window, document, send, enabled = true }) {
  let visitorId;
  let recorded = false;
  const identify = () => {
    if (visitorId) return visitorId;
    try { visitorId = window.localStorage.getItem('br-portfolio-visitor'); } catch {}
    if (!/^[a-f0-9-]{16,64}$/i.test(visitorId || '')) {
      visitorId = window.crypto?.randomUUID?.();
      if (visitorId) {
        try { window.localStorage.setItem('br-portfolio-visitor', visitorId); } catch {}
      }
    }
    return visitorId;
  };
  const record = details => {
    if (!enabled || window.navigator?.doNotTrack === '1') return;
    try {
      if (!identify()) return;
      Promise.resolve(send({ visitorId, path: window.location.pathname, ...details })).catch(() => {});
    } catch { /* Analytics must never prevent reading or following a link. */ }
  };
  const recordVisit = () => {
    if (recorded) return;
    recorded = true;
    record({ type: 'page_view' });
  };
  const start = () => {
    recordVisit();
    const onClick = event => {
      if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
      const link = event.target?.closest?.('a[href]');
      if (!link) return;
      try {
        const url = new URL(link.href, window.location.href);
        if (!['http:', 'https:'].includes(url.protocol)) return;
        // Never send query strings, credentials, or arbitrary fragment contents.
        const target = url.origin === window.location.origin
          ? (url.pathname === window.location.pathname && url.hash === '#top' ? '#top' : url.pathname)
          : `${url.origin}${url.pathname}`;
        record({ type: 'link_click', target });
      } catch {}
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  };
  return { recordVisit, start };
}
