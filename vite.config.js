import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.SITE_BASE || '/';
// Link previews need an absolute image URL. On Vercel, point every build (previews
// included) at the production domain; SITE_URL overrides it anywhere else.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
const siteUrl = (process.env.SITE_URL || vercelUrl)?.replace(/\/$/, '');

export default defineConfig({
  base,
  plugins: [react(), {
    name: 'portfolio-metadata',
    transformIndexHtml(html) {
      return html.replaceAll('__SOCIAL_IMAGE__', `${siteUrl || base.replace(/\/$/, '')}/img/social-card.png`);
    },
  }],
  server: { port: 4173, host: '127.0.0.1' },
});
