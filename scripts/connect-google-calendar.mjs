// Owner-only setup utility. Not served by Vite or deployed with the website.
import { createServer } from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, rename, chmod } from 'node:fs/promises';
import { loadEnv } from 'vite';

const env = { ...loadEnv('development', process.cwd(), ''), ...process.env };
const port = 53682;
const redirect = `http://127.0.0.1:${port}/oauth2/callback`;
if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_OWNER_EMAIL) {
  console.error(`Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_OWNER_EMAIL to .env.local first. Configure the Google web OAuth client with this exact redirect URI: ${redirect}`);
  process.exit(1);
}
const scopes = ['https://www.googleapis.com/auth/calendar.freebusy', 'https://www.googleapis.com/auth/userinfo.email'];
const state = randomBytes(32).toString('base64url');
const verifier = randomBytes(48).toString('base64url');
const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
auth.search = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: redirect, response_type: 'code', scope: scopes.join(' '), access_type: 'offline', prompt: 'consent', state, code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', login_hint: env.GOOGLE_OWNER_EMAIL }).toString();
let used = false;
const server = createServer(async (request, response) => {
  const reply = (status, text) => { response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'" }); response.end(text); };
  const url = new URL(request.url, redirect);
  if (request.method !== 'GET' || request.headers.host !== `127.0.0.1:${port}` || url.pathname !== '/oauth2/callback') return reply(404, 'Not found.');
  const received = Buffer.from(url.searchParams.get('state') || '');
  if (used || received.length !== state.length || !timingSafeEqual(received, Buffer.from(state))) return reply(400, 'This authorization request is invalid or has expired.');
  used = true;
  try {
    if (url.searchParams.has('error') || !url.searchParams.get('code')) throw new Error('Google authorization was not completed.');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000), headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, code: url.searchParams.get('code'), code_verifier: verifier, grant_type: 'authorization_code', redirect_uri: redirect }),
    });
    if (!tokenResponse.ok) throw new Error('Google could not exchange the authorization code. Check the OAuth client and redirect URI, then rerun this command.');
    const token = await tokenResponse.json();
    if (!token.refresh_token || !token.access_token) throw new Error('Google did not return an offline token. Reconnect and grant the requested permissions.');
    const granted = new Set((token.scope || '').split(' '));
    const missingScopes = scopes.filter(scope => !granted.has(scope));
    if (missingScopes.length) throw new Error(`Google did not grant: ${missingScopes.map(scope => scope.endsWith('/calendar.freebusy') ? 'calendar availability (select its checkbox on the consent screen)' : 'account email verification').join(', ')}. Nothing was saved. Reconnect and approve these permissions.`);
    const identityResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${token.access_token}` }, redirect: 'error', signal: AbortSignal.timeout(10000) });
    if (!identityResponse.ok) throw new Error('The Google account could not be verified. Nothing was saved.');
    const identity = await identityResponse.json();
    if (!identity.verified_email || identity.email?.toLowerCase() !== env.GOOGLE_OWNER_EMAIL.toLowerCase()) throw new Error('The selected Google account does not match GOOGLE_OWNER_EMAIL. Nothing was saved.');
    const path = new URL('../.env.local', import.meta.url);
    let contents = await readFile(path, 'utf8').catch(error => { if (error.code === 'ENOENT') return ''; throw error; });
    const updates = { GOOGLE_REFRESH_TOKEN: token.refresh_token, GOOGLE_CALENDAR_ID: env.GOOGLE_CALENDAR_ID || 'primary' };
    for (const [name, value] of Object.entries(updates)) {
      const line = `${name}=${JSON.stringify(value)}`;
      const pattern = new RegExp(`^${name}=.*$`, 'm');
      contents = pattern.test(contents) ? contents.replace(pattern, () => line) : `${contents.trimEnd()}\n${line}\n`;
    }
    const temporary = new URL(`../.google-calendar-${randomBytes(8).toString('hex')}.local`, import.meta.url);
    await writeFile(temporary, contents, { mode: 0o600, flag: 'wx' });
    await rename(temporary, path); await chmod(path, 0o600);
    console.log('Google Calendar authorized. The refresh token was saved in .env.local without displaying it.');
    reply(200, 'Google Calendar is connected for local development. You can close this tab. Meeting hours and booking mode remain controlled by the website owner.');
  } catch (error) { console.error(error instanceof TypeError ? 'Google authorization could not be completed. Please rerun the setup command.' : error.message); reply(400, 'The connection could not be completed. Check the local setup terminal and try again.'); process.exitCode = 1; }
  finally { clearTimeout(timeout); server.close(); }
});
const timeout = setTimeout(() => { console.error('Calendar authorization expired. Rerun the setup command when ready.'); server.close(); process.exitCode = 1; }, 10 * 60000);
server.on('error', () => { clearTimeout(timeout); console.error('The local Calendar setup port is unavailable. Close any previous setup command and try again.'); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => {
  console.log(`Open this Google authorization URL in your browser. Requested access: availability only, plus account email verification.`);
  console.log(auth.href);
});
