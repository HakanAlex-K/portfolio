# Hakan's portfolio

Resume-aligned portfolio for Hakan Alex Kucukhuseyin: Electrical Engineering and Computer Engineering double major at Drexel, with a Finance minor. React 19, Vite, Motion, and Lucide. Static hosting; no backend required.

## Run and verify

Use Node 22.

```sh
npm ci
npm run dev
```

The development URL is http://127.0.0.1:4173. For a production build and browser checks:

```sh
npx playwright install chromium
npm run verify
```

`npm run build` writes `dist`. `npm run preview` serves that build. `npm run check` starts a production preview and checks five viewport widths, all five projects, image and PDF loading, keyboard controls, dialogs, navigation, clipboard, reduced motion, hero pause, metadata, and browser errors. Screenshots and results go to `test-results/`.

For an existing preview, set `CHECK_URL` to its URL and `SITE_BASE` to its path. `BROWSER_EXECUTABLE_PATH` optionally selects an installed Chromium browser. These settings are only needed for local verification.

## Deploy

Hosted on Vercel; see [DEPLOYMENT.md](DEPLOYMENT.md). Pushes to `main` deploy to production, and GitHub Actions runs the browser check on every push and pull request.

## Content sources

`public/resume.pdf` is the user's supplied original PDF, copied without rewriting. It is the authoritative source for the name, email, education, dates, roles, project scope, and skills. Replace this file with the next approved resume; do not regenerate it from an old HTML template.

- `src/data/profile.js`: name, contact, graduation, GPAs, availability, and external links. LinkedIn remains hidden because no URL was supplied.
- `src/data/projects.js`: five project entries; four screenshot projects are featured in the hero preview.
- `src/components/Sections.jsx`: education, skills, experience, and contact.
- `src/components/Work.jsx`: project narratives, real screenshot viewers, and the Verilog computer architecture overview.
- `src/lib/assets.js`: base-path-safe asset URLs, for hosting under a subpath.
- `tools/build-social-card.mjs`: regenerates the committed social sharing image after profile changes (`node tools/build-social-card.mjs`).

The supplied resume describes the original March-June 2025 glucose monitor with TensorFlow/Keras and 600-feature IR/red vectors. The public VitalView dashboard is a later scikit-learn iteration. The site labels that distinction and does not attribute later demo metrics to the original prototype. All dashboard captures use synthetic signals.

Blues product screenshots are shown with permission and fictional customer identities. The production portal address is not published. UniTR screenshots use its sample fallback; custom rankings are not an official league table. The Hack computer visual is a conceptual architecture diagram, not a simulation capture.

The existing Apr-Aug 2027 co-op availability and language/location preferences are retained from the site; the resume does not specify those preferences.

## Local archives

`reference/` contains older designs, the obsolete generated resume, unused assets, and capture helpers tied to local source projects. `shots/` contains working captures. Both are ignored by Git and excluded from deployment. The current site can build and be checked without these archives or any sibling repository.
