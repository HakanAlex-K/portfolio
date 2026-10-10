// Renders the app to HTML after `vite build`, so the content is readable without
// JavaScript (recruiter tools, AI screeners, search engines). React hydrates it in the browser.
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const page = 'dist/index.html';
const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href);

const html = await fs.readFile(page, 'utf8');
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error(`${page} has no empty #root to fill`);

await fs.writeFile(page, html.replace(placeholder, `<div id="root">${render()}</div>`));
await fs.rm('dist-ssr', { recursive: true, force: true });
console.log(`Pre-rendered ${page}`);
