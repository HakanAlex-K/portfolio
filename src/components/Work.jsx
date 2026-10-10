import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { ArrowUpRight, ChevronDown, Github, Lock, Monitor, Pause, Play, Smartphone, Trophy } from 'lucide-react';
import { Browser, Reveal, Shot, useReducedMotionSafe } from './primitives.jsx';
import { phones, screens } from '../data/blues.js';
import { vvScreens } from '../data/vitalview-screens.js';
import { assetUrl } from '../lib/assets.js';
import { projects } from '../data/projects.js';

/* ================================================================== */
/* Auto-cycling screenshot viewer (tabs, progress bar, device toggle)  */
/* ================================================================== */
function ProductViewer({ id, screens, phones, overlay, label }) {
  const [active, setActive] = useState(0);
  const [device, setDevice] = useState('desktop');
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(true);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const reduce = useReducedMotionSafe();
  const playing = inView && !hover && !focused && !paused && !reduce && device === 'desktop';
  const screen = screens[active];

  // Warm the cache so switching tabs never flashes
  useEffect(() => { if (inView) screens.forEach((s) => { const i = new Image(); i.src = assetUrl(s.src); }); }, [screens, inView]);

  const select = (i) => { setDevice('desktop'); setActive(i); };
  const onTabKey = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? screens.length - 1 : (i + dir + screens.length) % screens.length;
    select(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div className="viewer" ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocus={() => setFocused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
      <div className="viewer-bar"><span className="viewer-title">Explore the real interface</span>
        <div className="tabs guided-tabs" role="tablist" aria-label={label} hidden={device !== 'desktop'}>
          {screens.map((s, i) => {
            const on = device === 'desktop' && i === active;
            return (
              <button
                key={s.id} id={`${id}-tab-${i}`} role="tab" aria-selected={on} aria-controls={`${id}-panel`} tabIndex={i === active ? 0 : -1}
                className={`tab ${on ? 'is-active' : ''}`} onClick={() => select(i)} onKeyDown={(e) => onTabKey(e, i)}
              >
                {on && <motion.span layoutId={`${id}-tab-bg`} className="tab-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                <span className="tab-label">{s.label}</span><span className="tab-hint">{i === 0 ? "Start here" : "Take a closer look"}</span>
                {on && !paused && !reduce && (
                  <span
                    key={active} className={`tab-progress ${playing ? '' : 'paused'}`}
                    onAnimationEnd={() => { if (playing) setActive((a) => (a + 1) % screens.length); }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="viewer-controls">
        {!reduce && device === 'desktop' && <button className="viewer-play" onClick={() => setPaused(!paused)} aria-pressed={!paused} aria-label={paused ? 'Enable slideshow' : 'Pause slideshow'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
        {phones && (
          <div className="seg" role="group" aria-label="Device">
            <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')} aria-pressed={device === 'desktop'} aria-label="Desktop screens"><Monitor size={15} /></button>
            <button className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')} aria-pressed={device === 'mobile'} aria-label="Mobile screens"><Smartphone size={15} /></button>
          </div>
        )}
        </div>
      </div>

      <div className="viewer-stage" id={`${id}-panel`} role={device === 'desktop' ? 'tabpanel' : 'region'} aria-labelledby={device === 'desktop' ? `${id}-tab-${active}` : undefined} aria-label={device === 'mobile' ? 'Mobile screenshots' : undefined}>
        {device === 'desktop' && overlay}
        <AnimatePresence mode="wait" initial={false}>
          {device === 'desktop' ? (
            <motion.div
              key={screen.id}
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Browser url={screen.url}>
                <Shot src={screen.src} full={screen.full} alt={`${screen.label}: ${screen.caption}`} width={1600} height={1000} />
              </Browser>
              <p className="viewer-caption"><span>{String(active + 1).padStart(2, '0')}</span>{screen.caption}</p>
            </motion.div>
          ) : (
            <motion.div
              key="mobile" className="phones"
              initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {phones.map((p, i) => (
                <motion.figure
                  key={p.src} className="phone"
                  initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="phone-body"><Shot src={p.src} alt={p.alt} width={780} height={1688} /></div>
                  <figcaption>{p.label}</figcaption>
                </motion.figure>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


function Blues() {
  return (
    <article className="project chapter blues-chapter" id="blues">
      <Reveal className="case-intro">
        <div className="case-heading"><div className="project-meta"><span className="tag tag-live"><i /> In daily use</span><span>Göcek & Bodrum, Türkiye</span></div><h3>01 / Blues Yachting</h3><h4>One platform.<br /><span>The whole operation.</span></h4></div>
        <div className="case-setup"><p>An 18-module platform for quoting, CRM, inventory, and payments. As sole engineer, I took it from requirements to deployment and support.</p><span className="role-note">Software Developer · 2023–24, 2025</span></div>
      </Reveal>
      <Reveal className="story-change"><div><span className="story-label">Before</span><p>Spreadsheets, manual tax math, and quotes rebuilt for every sale.</p></div><span className="story-change-arrow" aria-hidden="true">→</span><div><span className="story-label">After</span><p>Shared records, automated pricing, and one-click PDF quotes.</p></div><div className="story-result"><strong>18 modules.</strong><span>~85% less quote preparation time.</span></div></Reveal>
      <Reveal className="demo-introduction"><div><span className="story-label">Product walkthrough</span><h4>Explore the platform.</h4></div><p>Pick a workflow, or switch to mobile.</p></Reveal>
      <Reveal><ProductViewer id="blues" label="Portal screens" screens={screens} phones={phones} /><p className="permission"><Lock size={13} /> Real screens, shown with permission. Customer data is fictional.</p></Reveal>
      <Reveal className="project-bottom"><div className="stack-row">{['React 19', 'Node · Express · Zod', 'PostgreSQL', 'Docker · Caddy', 'GitHub Actions CI', 'Puppeteer PDF', 'PWA'].map(t => <span key={t}>{t}</span>)}</div><details className="project-story"><summary>Engineering decisions <ChevronDown size={18} /></summary><div className="story-grid"><div><span className="eyebrow">Consistent financial data</span><p>PDFs and customer pages share one template; each currency is tracked separately.</p></div><div><span className="eyebrow">Production reliability</span><p>CI runs end-to-end tests against a throwaway database on every push, plus staging and nightly backups.</p></div><div><span className="eyebrow">User feedback</span><p>I train the team and ship improvements from their feedback.</p></div></div></details></Reveal>
    </article>
  );
}

const vv = projects.find((p) => p.id === 'vitalview');

function VitalView() {
  return (
    <article className="project chapter vital-chapter" id="vitalview">
      <Reveal className="case-intro"><div className="case-heading"><div className="project-meta"><span className="tag tag-gold"><Trophy size={13} /> 1st place · Freshman Engineering Design</span><span>March–June 2025 · Team Lead</span></div><h3>02 / VitalView</h3><h4>From optical signals<br /><span>to model inference.</span></h4></div><div className="case-setup"><p>A wearable sensing prototype: ESP32/PPG hardware, a Node.js API, TensorFlow/Keras inference, and a React dashboard. First place at Drexel’s Freshman Engineering Design competition.</p><span className="role-note">Team Lead · System integration</span></div></Reveal>
      <Reveal className="story-change vital-change"><div><span className="story-label">Integration</span><p>Sensing, capture, inference, and dashboard in one prototype.</p></div><span className="story-change-arrow" aria-hidden="true">→</span><div><span className="story-label">Signal validation</span><p>Reject flatline and low-amplitude readings before inference.</p></div><div className="story-result"><strong>600 features.</strong><span>IR/red signal vectors</span></div></Reveal>
      <Reveal className="demo-introduction"><div><span className="story-label">Research dashboard</span><h4>Inspect the later software iteration.</h4></div><p>The public demo, rebuilt with scikit-learn on synthetic signals.</p></Reveal>
      <Reveal className="vv-links"><a className="btn vv-demo" href={vv.url} target="_blank" rel="noreferrer">Open the live demo <ArrowUpRight size={16} /></a><a className="btn vv-repo" href={vv.repo} target="_blank" rel="noreferrer"><Github size={16} /> Source on GitHub</a></Reveal>
      <Reveal><ProductViewer id="vv" label="VitalView dashboard screens" screens={vvScreens} /></Reveal>
      <div className="project-bottom"><div className="stack-row">{['ESP32 · I²C', 'Dual MAX30105', 'Node API', 'Python · scikit-learn', 'React 19'].map(t => <span key={t}>{t}</span>)}</div><p className="fineprint">Demo metrics describe the later iteration, not the original TensorFlow/Keras prototype. Research prototype, not a medical device.</p></div>
    </article>
  );
}

const tsaUrl = projects.find((p) => p.id === 'drexel-tsa').url;

function WebProjects() {
  return (
    <div className="web-projects">
      <Reveal as="article" className="project web-project tsa-project" id="drexel-tsa">
        <div className="web-project-copy"><div className="tsa-meta"><span className="tag tag-live"><i /> Live</span><span>Launched October 2026</span></div><span className="world-label">03 / Community website</span><h3>Drexel Turkish<br /><em>Student Association.</em></h3><p>I designed and built the association’s website for events, resources, and community updates.</p><div className="web-story-pair"><div><strong>Student experience</strong><p>Events, gallery, blog, and joining through DragonLink.</p></div><div><strong>Board management</strong><p>A CMS lets the board update events, posts, and photos.</p></div></div><div className="tsa-visit-row"><a className="btn tsa-visit" href={tsaUrl} target="_blank" rel="noreferrer">Visit the website <ArrowUpRight size={16} /></a></div></div>
        <div className="web-project-visual"><Browser url="drexeltsa.vercel.app"><Shot src="/img/drexel-tsa.webp" full="/img/tsa-full.webp" alt="Drexel TSA homepage with its community introduction, association logo and events section." width={1440} height={900} /></Browser><span className="visual-caption">Live website · Student-facing homepage</span></div>
        <div className="web-project-bottom"><div className="stack-row">{['Next.js', 'React', 'TypeScript', 'Tailwind CSS'].map(t => <span key={t}>{t}</span>)}</div><details className="project-story"><summary>Behind the community hub <ChevronDown size={17} /></summary><div className="story-grid"><p>Runs on Vercel and Neon Postgres at $0/month.</p><p>Board login uses scrypt hashing, server-side sessions, CSRF checks, a nonce-based CSP, and rate limiting.</p></div></details></div>
      </Reveal>
      <Reveal as="article" className="project web-project rankings-project" id="university-rankings" delay={.08}>
        <div className="web-project-copy"><span className="world-label">04 / University discovery + data</span><h3>UniTR.<br /><em>Explore the options.</em></h3><p>Search Turkish universities and programs, backed by a Python pipeline for YÖKAtlas admissions data.</p><div className="web-story-pair"><div><strong>Search &amp; compare</strong><p>Filter by city and type; sort by rank, score, or name.</p></div><div><strong>Data engineering</strong><p>Reconcile records across 81 provinces and 4 years.</p></div></div></div>
        <div className="web-project-visual"><Browser url="UniTR / University rankings"><Shot src="/img/university-rankings.webp" alt="UniTR rankings page with search, city and institution filters, and ranked university cards." width={1440} height={900} /></Browser><span className="visual-caption">Sample dataset · Not an official ranking</span></div>
        <div className="web-project-bottom"><div className="stack-row">{['Next.js · TypeScript', 'Express', 'PostgreSQL', 'Python ETL'].map(t => <span key={t}>{t}</span>)}</div><details className="project-story"><summary>Behind the university explorer <ChevronDown size={17} /></summary><div className="story-grid"><p>A Python ETL loads YÖKAtlas data into PostgreSQL, using fuzzy matching to reconcile ~500 universities.</p><p>A TypeScript/Express API serves ranked university and program data. January 2025–present.</p></div></details></div>
      </Reveal>
    </div>
  );
}

function HackComputer() {
  return (
    <Reveal as="article" className="project hardware-project" id="hack-computer">
      <div className="hardware-copy">
        <div className="project-meta"><span className="tag">ECE 350</span><span>June–August 2026</span></div>
        <span className="world-label">05 / Computer architecture</span>
        <h3>A computer built<br /><em>from digital logic.</em></h3>
        <p>A stored-program <strong>Hack computer in Verilog</strong>: ALU, registers, CPU control, memory, and memory-mapped screen and keyboard I/O, validated with Hack machine-language programs.</p>
        <div className="stack-row">{['Verilog', 'Digital logic', 'Computer architecture', 'Memory-mapped I/O'].map(t => <span key={t}>{t}</span>)}</div>
      </div>
      <figure className="hardware-visual"><Shot src="/img/hack-computer.svg" alt="Conceptual architecture diagram showing instruction ROM feeding the Hack CPU, a program counter addressing ROM, and memory-mapped RAM, screen and keyboard I/O." width={1200} height={750} /><figcaption>Architecture overview · ECE 350 course project</figcaption></figure>
    </Reveal>
  );
}

const categories = ['Business software', 'Embedded + ML', 'Community website', 'Data platform', 'Digital logic'];
const summaries = ['18-module platform', '1st place · Drexel Design', 'Website + board CMS', 'Admissions data pipeline', 'Stored-program computer'];
export default function Work() {
  return (
    <section className="section" id="work"><div className="container">
      <Reveal className="section-head work-heading"><div><span className="section-kicker">01 / Selected work</span><h2>Ideas into<br /><span>working systems.</span></h2></div><p>Five projects across production software, embedded sensing, data, and digital logic.</p></Reveal>
      <div className="work-index">{projects.map((p, i) => <a key={p.id} className="world-card" href={'#' + p.id}><div className="world-card-top"><span className="mono">0{i + 1}</span><span>{categories[i]}</span><ArrowUpRight size={17} /></div><div className="world-card-image"><img src={assetUrl(p.src)} alt="" aria-hidden="true" width={1440} height={900} loading="lazy" /></div><div className="world-card-title"><strong>{i === 2 ? 'Drexel TSA' : i === 3 ? 'UniTR' : p.name}</strong><small>{summaries[i]}</small></div></a>)}</div>
      <Blues /><VitalView /><WebProjects /><HackComputer />
    </div></section>
  );
}
