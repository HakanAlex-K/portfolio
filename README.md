# Portfolio

My personal site. I'm an Electrical and Computer Engineering student at Drexel (Finance minor, class of 2028), and this is where I show the things I've built: a production platform for a yacht dealership, a wearable sensing prototype, a couple of full-stack web projects, and a computer built in Verilog.

Built with React 19, Vite, Motion, and Lucide icons. The page is pre-rendered at build time, so the full content is in the HTML for anything that doesn't run JavaScript, and React takes over in the browser. Hosted on Vercel.

## Running it locally

You'll need Node 22.

```sh
npm ci
npm run dev
```

Then open http://127.0.0.1:4173.

## Checks

I wrote a Playwright script that builds the site and clicks through it at five screen widths: every project, the screenshot viewers, keyboard navigation, the résumé download, link-preview metadata, and console errors. It runs on every push through GitHub Actions.

```sh
npx playwright install chromium
npm run verify
```

Screenshots from the run end up in `test-results/`.

## Where things live

- `src/data/profile.js`: contact info, graduation, GPA, availability, links
- `src/data/projects.js`: the project list
- `src/components/Work.jsx`: the project write-ups and screenshot viewers
- `src/components/Sections.jsx`: about, experience, and contact
- `public/resume.pdf`: my current résumé
- `tools/build-social-card.mjs`: regenerates the link-preview image (`node tools/build-social-card.mjs`)

## A few notes on the content

- The Blues Yachting screenshots are from the real product, shared with permission. Customer names and figures are fictional.
- The VitalView dashboard on the site is a later scikit-learn version of the project, running on synthetic signals. The original competition prototype used TensorFlow/Keras, and the site keeps the two separate.
- UniTR screenshots show official YÖK Atlas data, and the assistant answer is a real response. UniTR doesn't rank universities.

Deployment notes are in [DEPLOYMENT.md](DEPLOYMENT.md).
