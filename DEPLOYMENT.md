# Deploy to Vercel

The site is a static React/Vite build. No server, database, secrets, or environment variables are required.

## One-time setup

1. Push this folder to a GitHub repository (see below).
2. In Vercel, choose **Add New → Project**, import the repository, and keep the detected settings (`vercel.json` sets Vite, `npm run build`, and `dist`).
3. Deploy. Pushes to `main` publish to production; other branches and pull requests get preview URLs.
4. Open the production URL and test the résumé, project images, mobile menu, and contact email once.

Link previews (LinkedIn, Slack, iMessage) use an absolute social-image URL. `vite.config.js` builds it from Vercel's production domain automatically, including after you add a custom domain. To share a preview deployment's link with the right image, nothing extra is needed; it points at the production image.

**Custom domain:** Vercel project → **Settings → Domains**. Redeploy once after adding it so the social-image URL picks up the new domain.

## Checks

`.github/workflows/check.yml` runs the full browser check (`npm run verify`) on every push to `main` and every pull request. Vercel deploys independently, so if a check fails, fix it and push again; to roll back, promote an earlier deployment in Vercel's **Deployments** tab.

## First push from this folder

After creating an empty repository on GitHub:

```sh
git init -b main
git add .
git status
git commit -m "Portfolio ready for Vercel"
git remote add origin https://github.com/HakanAlex-K/YOUR_REPOSITORY.git
git push -u origin main
```

Review `git status` before committing. `.gitignore` excludes local screenshots, old reference projects, caches, environment files, dependencies, and build output.

## Verify locally

With Node 22:

```sh
npm ci
npx playwright install chromium
npm run verify
```

## Other hosts

`npm run build` writes `dist`. Set `SITE_BASE` when serving from a subpath (default `/`), and `SITE_URL` to the full site URL so link previews get an absolute image URL. The previous GitHub Pages workflow is kept in `reference/github-pages/` (not committed).
