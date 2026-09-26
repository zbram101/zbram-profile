import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';
import nodeCrypto from 'node:crypto';

const template = await readFile(new URL('../infrastructure/portfolio-chat.yml', import.meta.url), 'utf8');
const inlineCode = template.match(/        ZipFile: \|\n([\s\S]*?)(?=\n  ChatApi:)/)[1].split('\n').map(line => line.slice(10)).join('\n');
const origin = 'https://bharadwajramachandran.com';
function runtime({ limited = false, analyticsError = false } = {}) {
  const calls = [];
  const logs = [];
  const visitors = new Set();
  class Command { constructor(input) { this.input = input; } }
  class DynamoDBClient {
    async send(command) {
      calls.push(command.input);
      if (limited) throw Object.assign(new Error(), { name: 'ConditionalCheckFailedException' });
      if (command.input.TableName === 'test-visitors') {
        if (analyticsError) throw new Error('write unavailable');
        const key = `${command.input.Item.day.S}:${command.input.Item.visitorHash.S}`;
        if (visitors.has(key)) throw Object.assign(new Error(), { name: 'ConditionalCheckFailedException' });
        visitors.add(key);
      }
      return {};
    }
  }
  const module = { exports: {} };
  const context = createContext({
    module, exports: module.exports,
    require: name => ['node:crypto', 'crypto'].includes(name) ? nodeCrypto : { DynamoDBClient, PutItemCommand: Command, UpdateItemCommand: Command },
    process: { env: { CHAT_RATE_TABLE: 'test-rate', VISITOR_TABLE: 'test-visitors' } },
    crypto: nodeCrypto.webcrypto, Buffer, Request, Response, URL, AbortSignal, TextEncoder, TextDecoder, btoa, atob,
    fetch: () => { throw new Error('No network expected without an API key'); },
    console: { log: value => logs.push(value), error: value => logs.push(value) },
  });
  runInContext(inlineCode, context);
  return { handler: module.exports.handler, calls, logs };
}
const event = (body, extra = {}) => ({ requestContext: { http: { method: 'POST', sourceIp: '192.0.2.1' } }, headers: { origin, 'content-type': 'application/json' }, rawPath: '/chat', body: JSON.stringify(body), ...extra });

test('the exact generated AWS bundle serves the shared meeting flow and CORS', async () => {
  const { handler, calls, logs } = runtime();
  const result = await handler(event({ action: 'draft', details: { topic: 'A collaboration', timezone: 'Europe/London' } }));
  assert.equal(result.statusCode, 200);
  assert.equal(result.headers['access-control-allow-origin'], origin);
  assert.match(JSON.parse(result.body).cards[0].draft, /Europe\/London/);
  assert.equal(calls[0].TableName, 'test-rate');
  assert.match(calls[0].ConditionExpression, /requests < :limit/);
  assert.doesNotMatch(JSON.stringify(calls), /192\.0\.2\.1|A collaboration|Europe\/London/);
  assert.equal(logs.length, 0);
});

test('AWS rejects other origins and enforces the shared rate limit before work', async () => {
  const { handler, calls } = runtime();
  assert.equal((await handler(event({}, { headers: { origin: 'https://other.test' } }))).statusCode, 403);
  assert.equal(calls.length, 0);
  const limited = runtime({ limited: true });
  assert.equal((await limited.handler(event({ action: 'create' }))).statusCode, 429);
  assert.equal(limited.calls[0].ExpressionAttributeValues[':limit'].N, '6');
});

test('AWS preserves analytics and handles API Gateway base64 JSON', async () => {
  const { handler, calls, logs } = runtime();
  const visit = await handler(event({ visitorId: '12345678-1234-1234-1234-123456789abc', path: '/' }, { rawPath: '/event' }));
  assert.equal(visit.statusCode, 202);
  assert.equal(calls[0].TableName, 'test-visitors');
  assert.match(logs[0], /PageViews/);
  const raw = JSON.stringify({ action: 'draft', details: { topic: 'Hello' } });
  assert.equal((await handler(event(null, { body: Buffer.from(raw).toString('base64'), isBase64Encoded: true }))).statusCode, 200);
});

const visitorId = '12345678-1234-1234-1234-123456789abc';
const article = '/blog/context-platform-strategy-features-and-tradeoffs/';
const analyticsEvent = body => event({ visitorId, ...body }, { rawPath: '/event' });

test('blog views identify articles and preserve daily unique counting across pages', async () => {
  const { handler, logs, calls } = runtime();
  for (const path of ['/', '/blog/', article, article]) {
    assert.equal((await handler(analyticsEvent({ path, type: 'page_view' }))).statusCode, 202);
  }
  const records = logs.map(JSON.parse);
  assert.deepEqual(records.map(record => record.UniqueVisitors), [1, 0, 0, 0]);
  assert.deepEqual(records.map(record => record.PageViews), [1, 1, 1, 1]);
  assert.equal(records[1].BlogViews, 1);
  assert.equal(records[1].ArticleViews, undefined);
  assert.equal(records[2].ArticleViews, 1);
  assert.equal(records[2].Page, article);
  assert.equal(records[2].ArticleTitle, 'Context Platform: BI by AI, with repeatable intelligence');
  assert.equal(records[2].VisitorHash, nodeCrypto.createHash('sha256').update(visitorId).digest('hex'));
  assert.doesNotMatch(JSON.stringify({ logs, calls }), /12345678-1234|192\.0\.2\.1/);
  for (const record of records) {
    assert.deepEqual(record._aws.CloudWatchMetrics.map(metric => metric.Dimensions), [[['Site']], [['Site', 'Page']]]);
  }
});

test('click events retain known destinations and labels without inflating views or storing URL queries', async () => {
  const { handler, logs, calls } = runtime();
  assert.equal((await handler(analyticsEvent({ type: 'link_click', path: '/blog/', target: article, label: 'untrusted private text' }))).statusCode, 202);
  assert.equal((await handler(analyticsEvent({ type: 'link_click', path: article, target: 'https://docs.cube.dev/docs/introduction?token=private#secret' }))).statusCode, 202);
  const [indexClick, sourceClick] = logs.map(JSON.parse);
  assert.equal(indexClick.LinkTarget, article);
  assert.equal(indexClick.LinkLabel, 'Context Platform: BI by AI, with repeatable intelligence');
  assert.equal(sourceClick.LinkTarget, 'https://docs.cube.dev/docs/introduction');
  assert.equal(sourceClick.LinkLabel, 'Cube');
  assert.equal(sourceClick.LinkType, 'external');
  assert.equal(sourceClick.BlogLinkClicks, 1);
  assert.equal(sourceClick.PageViews, undefined);
  assert.equal(calls.length, 0);
  assert.doesNotMatch(JSON.stringify(logs), /private|secret|untrusted/);
});

test('analytics rejects invented pages, destinations, and event types before logging', async () => {
  const { handler, logs, calls } = runtime();
  const invalid = [
    { path: '/blog/not-published/' },
    { path: `${article}?email=private` },
    { path: article, type: 'purchase' },
    { path: article, visitorId: 'not-a-browser-id' },
    { path: article, type: 'link_click', target: 'https://unknown.test/private' },
    { path: article, type: 'link_click', target: 'javascript:alert(1)' },
  ];
  for (const body of invalid) assert.equal((await handler(analyticsEvent(body))).statusCode, 400);
  assert.equal(logs.length, 0);
  assert.equal(calls.length, 0);
});

test('analytics storage failure does not emit a successful view or unique metric', async () => {
  const { handler, logs } = runtime({ analyticsError: true });
  assert.equal((await handler(analyticsEvent({ path: article }))).statusCode, 503);
  assert.deepEqual(logs, ['analytics_write_failed']);
});
