import nodeCrypto from 'node:crypto';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { handleChat } from './chat.js';
const crypto = nodeCrypto;
const dynamo = new DynamoDBClient({ maxAttempts: 2 });
const allowedOrigins = new Set([
  'https://bharadwajramachandran.com',
  'https://www.bharadwajramachandran.com',
  'https://codex-modernize-portfolio.dn8ysw76ubukd.amplifyapp.com',
]);
const response = (status, body, origin) => ({ statusCode: status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...(origin ? { 'access-control-allow-origin': origin, vary: 'Origin' } : {}) }, body: JSON.stringify(body) });
const keyFrom = value => { const raw = (value || '').trim(); if (!raw || !raw.startsWith('{')) return raw; try { const object = JSON.parse(raw); return object.OPENAI_API_KEY || object.openai_api_key || object.apiKey || object.key || Object.values(object).find(value => typeof value === 'string' && value.startsWith('sk-')) || ''; } catch { return ''; } };
const emitMetrics = (metrics, page) => console.log(JSON.stringify({ _aws: { Timestamp: Date.now(), CloudWatchMetrics: [{ Namespace: 'PortfolioAnalytics', Dimensions: [['Site']], Metrics: Object.keys(metrics).map(Name => ({ Name, Unit: 'Count' })) }, ...(page ? [{ Namespace: 'PortfolioAnalytics', Dimensions: [['Site', 'Page']], Metrics: [{ Name: 'PageViews', Unit: 'Count' }] }] : [])] }, Site: 'bharadwajramachandran.com', ...(page ? { Page: page } : {}), ...metrics }));
const readBody = event => { try { return JSON.parse(event.body || '{}'); } catch { return null; } };
const recordVisit = async (event, origin) => {
  const body = readBody(event);
  const visitorId = body?.visitorId;
  const page = body?.path;
  if (typeof visitorId !== 'string' || !/^[a-f0-9-]{16,64}$/i.test(visitorId) || typeof page !== 'string' || !/^\/[a-z0-9/_-]*$/i.test(page) || page.length > 80) return response(400, { error: 'Invalid analytics event.' }, origin);
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = crypto.createHash('sha256').update(visitorId).digest('hex');
  let uniqueVisitors = 0;
  try {
    await dynamo.send(new PutItemCommand({ TableName: process.env.VISITOR_TABLE, Item: { day: { S: day }, visitorHash: { S: visitorHash }, expiresAt: { N: String(Math.floor(Date.now() / 1000) + 34560000) } }, ConditionExpression: 'attribute_not_exists(visitorHash)' }));
    uniqueVisitors = 1;
  } catch (error) {
    if (error.name !== 'ConditionalCheckFailedException') { console.error('analytics_write_failed'); return response(503, { error: 'Analytics is temporarily unavailable.' }, origin); }
  }
  emitMetrics({ PageViews: 1, UniqueVisitors: uniqueVisitors }, page);
  return response(202, { recorded: true }, origin);
};

async function rateLimit(event, body, key) {
  if (!process.env.CHAT_RATE_TABLE) throw new Error('Rate limiting is not configured.');
  const minute = Math.floor(Date.now() / 60000);
  const action = body?.action;
  const category = action === 'poll' ? 'poll' : action === 'create' ? 'create' : ['cancel', 'reset'].includes(action) ? 'cleanup' : 'message';
  const limit = { poll: 90, create: 6, cleanup: 20, message: 12 }[category];
  const address = event.requestContext?.http?.sourceIp || 'unknown';
  const clientHash = nodeCrypto.createHmac('sha256', key || 'portfolio-profile-mode').update(`${minute}:${address}`).digest('hex');
  try {
    await dynamo.send(new UpdateItemCommand({
      TableName: process.env.CHAT_RATE_TABLE,
      Key: { id: { S: `${category}:${minute}:${clientHash}` } },
      UpdateExpression: 'SET expiresAt = :expiry ADD requests :one',
      ConditionExpression: 'attribute_not_exists(requests) OR requests < :limit',
      ExpressionAttributeValues: { ':expiry': { N: String((minute + 5) * 60) }, ':one': { N: '1' }, ':limit': { N: String(limit) } },
    }), { abortSignal: AbortSignal.timeout(2500) });
    return true;
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') return false;
    throw error;
  }
}

export async function handler(event) {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const acceptedOrigin = allowedOrigins.has(origin) ? origin : '';
  const method = event.requestContext?.http?.method;
  if (method !== 'GET' && !acceptedOrigin) return response(403, { error: 'This request must come from the portfolio.' });
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  if (Buffer.byteLength(rawBody) > 40000) return response(413, { error: 'The request is too long.' }, acceptedOrigin);
  const normalizedEvent = { ...event, body: rawBody };
  if (event.rawPath === '/event') {
    if (method !== 'POST') return response(405, { error: 'Use POST.' }, acceptedOrigin);
    return recordVisit(normalizedEvent, acceptedOrigin);
  }
  const key = keyFrom(process.env.OPENAI_SECRET);
  const body = readBody(normalizedEvent);
  if (method === 'POST') {
    try {
      if (!await rateLimit(event, body, key)) return response(429, { error: 'Please wait a moment before trying again.' }, acceptedOrigin);
    } catch { return response(503, { error: 'The assistant is temporarily unavailable.' }, acceptedOrigin); }
  }
  const request = new Request('https://portfolio-api.internal/api/chat', {
    method, headers: event.headers,
    ...(method === 'POST' ? { body: rawBody } : {}),
  });
  const result = await handleChat(request, {
    OPENAI_API_KEY: key, OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_AGENT_MODEL: process.env.OPENAI_AGENT_MODEL,
    OPENAI_AGENT_ID: process.env.OPENAI_AGENT_ID,
    CHAT_BACKEND: process.env.CHAT_BACKEND,
    BOOKING_URL: process.env.BOOKING_URL, MEETING_DETAILS: process.env.MEETING_DETAILS,
    GOOGLE_CALENDAR_SECRET: process.env.GOOGLE_CALENDAR_SECRET,
    GOOGLE_CALENDAR_RULES: process.env.GOOGLE_CALENDAR_RULES,
    CHAT_ALLOWED_ORIGINS: [...allowedOrigins].join(','),
  });
  if (method === 'POST' && result.ok && (body?.action === 'message' || body?.messages)) emitMetrics({ ChatMessages: 1 });
  return { statusCode: result.status, headers: { ...Object.fromEntries(result.headers), ...(acceptedOrigin ? { 'access-control-allow-origin': acceptedOrigin, vary: 'Origin' } : {}) }, body: await result.text() };
}
