import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';
import nodeCrypto from 'node:crypto';

const template = await readFile(new URL('../infrastructure/portfolio-chat.yml', import.meta.url), 'utf8');
const inlineCode = template.match(/        ZipFile: \|\n([\s\S]*?)(?=\n  ChatApi:)/)[1].split('\n').map(line => line.slice(10)).join('\n');
const origin = 'https://bharadwajramachandran.com';
function runtime({ limited = false } = {}) {
  const calls = [];
  const logs = [];
  class Command { constructor(input) { this.input = input; } }
  class DynamoDBClient { async send(command) { calls.push(command.input); if (limited) throw Object.assign(new Error(), { name: 'ConditionalCheckFailedException' }); return {}; } }
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
