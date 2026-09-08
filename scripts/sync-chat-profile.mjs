import { readFile, writeFile } from 'node:fs/promises';
import { profile } from '../src/profile.js';

const path = new URL('../infrastructure/portfolio-chat.yml', import.meta.url);
const template = await readFile(path, 'utf8');
const declaration = /^          const profile = .*;$/m;
if (!declaration.test(template)) throw new Error('Cannot find the deployed chat profile declaration.');
const updated = template.replace(declaration, () => `          const profile = ${JSON.stringify(profile)};`)
  .replace('using only this profile: ${profile}', 'using only this profile: ${JSON.stringify(profile)}');
if (process.argv.includes('--check')) {
  if (template !== updated) throw new Error('The deployed chat profile is out of date. Run npm run sync:profile.');
} else if (template !== updated) {
  await writeFile(path, updated);
  console.log('Synced the deployed chat profile with src/profile.js.');
}
