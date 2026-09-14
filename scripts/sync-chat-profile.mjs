import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const path = new URL('../infrastructure/portfolio-chat.yml', import.meta.url);
const template = await readFile(path, 'utf8');
const declaration = /        ZipFile: \|\n[\s\S]*?(?=\n  ChatApi:)/;
if (!declaration.test(template)) throw new Error('Cannot find the deployed chat code block.');
const result = await build({ entryPoints: ['server/lambda.js'], bundle: true, format: 'cjs', platform: 'node', target: 'es2022', external: ['@aws-sdk/client-dynamodb'], write: false, minify: true, legalComments: 'none' });
const code = result.outputFiles[0].text.trim().split('\n').map(line => line ? `          ${line}` : '').join('\n');
const updated = template.replace(declaration, () => `        ZipFile: |\n${code}\n`);
if (process.argv.includes('--check')) {
  if (template !== updated) throw new Error('The deployed agent code or portfolio is out of date. Run npm run sync:profile.');
} else if (template !== updated) {
  await writeFile(path, updated);
  console.log('Synced the AWS handler with the shared agent, scheduling, and portfolio code.');
}
