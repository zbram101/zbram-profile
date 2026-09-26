import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPageAnalytics } from './analytics-client.js';

function fixture({ blockedStorage = false, enabled = true, doNotTrack, send } = {}) {
  const events = [];
  const stored = new Map();
  const listeners = new Map();
  let ids = 0;
  const window = {
    location: new URL('https://bharadwajramachandran.com/blog/'),
    navigator: { doNotTrack },
    crypto: { randomUUID: () => `12345678-1234-1234-1234-${String(++ids).padStart(12, '0')}` },
    localStorage: {
      getItem: key => { if (blockedStorage) throw new Error('blocked'); return stored.get(key); },
      setItem: (key, value) => { if (blockedStorage) throw new Error('blocked'); stored.set(key, value); },
    },
  };
  const document = {
    addEventListener: (type, fn) => { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
  };
  const analytics = createPageAnalytics({ window, document, enabled, send: send || (event => events.push(event)) });
  const click = (href, type = 'click', button = 0) => {
    for (const listener of listeners.get(type) || []) listener({ type, button, target: { closest: () => ({ href }) } });
  };
  return { analytics, events, click, listeners, window };
}

test('effect replays record one view and leave one click listener, with cleanup', () => {
  const { analytics, events, click } = fixture();
  analytics.start()();
  const cleanup = analytics.start();
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'page_view');
  click('/blog/context-platform-strategy-features-and-tradeoffs/');
  assert.equal(events.length, 2);
  assert.equal(events[1].type, 'link_click');
  assert.equal(events[0].visitorId, events[1].visitorId);
  cleanup();
  click('/');
  assert.equal(events.length, 2);
});

test('blocked storage does not break reading and keeps one in-memory ID', () => {
  const { analytics, events, click } = fixture({ blockedStorage: true });
  assert.doesNotThrow(() => analytics.start());
  click('/');
  assert.equal(events.length, 2);
  assert.equal(events[0].visitorId, events[1].visitorId);
});

test('link tracking strips sensitive URL parts and handles middle-click without duplicates', () => {
  const { analytics, events, click } = fixture();
  analytics.start();
  click('https://example.com/reference?email=private@example.com#secret');
  click('/blog/?token=secret');
  click('#top');
  click('https://example.com/middle', 'click', 1);
  click('https://example.com/middle', 'auxclick', 1);
  click('https://example.com/right', 'auxclick', 2);
  click('mailto:private@example.com');
  assert.deepEqual(events.slice(1).map(event => event.target), ['https://example.com/reference', '/blog/', '#top', 'https://example.com/middle']);
  assert.doesNotMatch(JSON.stringify(events), /secret|private@example/);
});

test('disabled tracking and Do Not Track send no events', () => {
  for (const options of [{ enabled: false }, { doNotTrack: '1' }]) {
    const { analytics, events, click } = fixture(options);
    analytics.start();
    click('/');
    assert.equal(events.length, 0);
  }
});

test('rejected or unavailable transport never breaks page interactions', async () => {
  for (const send of [() => Promise.reject(new Error('offline')), () => { throw new Error('blocked'); }]) {
    const { analytics, click } = fixture({ send });
    assert.doesNotThrow(() => analytics.start());
    assert.doesNotThrow(() => click('/'));
  }
  await new Promise(resolve => setImmediate(resolve));
});
