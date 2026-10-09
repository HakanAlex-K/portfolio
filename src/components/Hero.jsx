import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, FileText, Pause, Play } from 'lucide-react';
import { profile } from '../data/profile.js';
import { projects as allProjects } from '../data/projects.js';
import { assetUrl } from '../lib/assets.js';

const projects = allProjects.filter(p => p.featured !== false);
const highlights = [
  { label: 'Production software', description: 'An operating platform for a yacht dealership.', facts: [['18', 'integrated modules'], ['~85%', 'less quote preparation']] },
  { label: 'Embedded systems + ML', description: 'Optical sensing, inference, and a research dashboard.', facts: [['1st place', 'Freshman Engineering Design'], ['ESP32', 'sensor integration']] },
  { label: 'Community website', description: 'A student community, with tools to keep it running.', facts: [['Live', 'at Drexel University'], ['CMS', 'managed by the board']] },
  { label: 'Data + full-stack development', description: 'University discovery built on admissions data.', facts: [['81', 'provinces in the data pipeline'], ['4 years', 'of admissions data']] },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const playing = !paused && !held && !hidden && !reduce;
  const project = projects[current];
  const highlight = highlights[current];

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onTabKey = (e, i) => {
    const direction = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!direction && !['Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? projects.length - 1 : (i + direction + projects.length) % projects.length;
    setCurrent(to);
    document.getElementById(`entry-tab-${to}`)?.focus();
  };
  const enter = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="entry" id="top" aria-labelledby="hero-title">
      <div className="container entry-layout">
        <div className="entry-copy">
          <motion.p {...enter(0)} className="entry-hello"><span className="intro-rule" /> Hakan Alex Kucukhuseyin</motion.p>
          <motion.h1 {...enter(0.06)} id="hero-title">Building across<br /><span>software &amp;<br />hardware.</span></motion.h1>
          <motion.p {...enter(0.12)} className="entry-bio">I’m an Electrical and Computer Engineering student at Drexel. I build production software, embedded prototypes, and the systems that connect them.</motion.p>
          <motion.div {...enter(0.18)} className="entry-cta">
            <a className="btn btn-primary" href="#work">Explore my work <ArrowDown size={17} /></a>
            <a className="entry-resume" href={assetUrl(profile.links.resume)} target="_blank" rel="noreferrer"><FileText size={16} /> Résumé <ArrowUpRight size={15} /></a>
          </motion.div>
          <motion.a {...enter(0.24)} className="entry-availability" href="#contact"><span className="status-dot" /> Available for {profile.availability} <ArrowUpRight size={14} /></motion.a>
        </div>

        <motion.div {...enter(0.15)} className="entry-stage"
          onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld(false); }}>
          <div className="feature-topline"><span>Selected project</span><span className="mono">0{current + 1} / 0{projects.length}</span></div>
          <div className="feature-frame">
            <div className="feature-category"><span className="feature-indicator" />{highlight.label}<span className="feature-cross" aria-hidden="true">+</span></div>
            <div className="deck" id="entry-deck" role="tabpanel" aria-labelledby={`entry-tab-${current}`}>
              <AnimatePresence initial={false} mode="wait">
                <motion.a key={project.id} className="deck-card is-front" href={`#${project.id}`} aria-label={`Read about ${project.name}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <div className="feature-browser" aria-hidden="true"><span><i /><i /><i /></span><span>{project.shortName} / project preview</span><ArrowUpRight size={12} /></div>
                  <img src={assetUrl(project.src)} alt={project.alt} width={1440} height={900} fetchPriority={current === 0 ? 'high' : undefined} />
                  <span className="deck-label"><span><strong>{project.shortName === 'Drexel TSA' ? 'Drexel TSA' : project.name}</strong><small>{highlight.description}</small></span><ArrowUpRight size={22} /></span>
                </motion.a>
              </AnimatePresence>
            </div>
            <div className="feature-facts">{highlight.facts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          </div>
          <div className="entry-tabs" role="tablist" aria-label="Projects">
            {projects.map((p, i) => (
              <button key={p.id} id={`entry-tab-${i}`} role="tab" aria-selected={i === current} aria-controls="entry-deck" tabIndex={i === current ? 0 : -1} onClick={() => setCurrent(i)} onKeyDown={(e) => onTabKey(e, i)}>
                <span className="entry-tab-num">0{i + 1}</span><span className="entry-tab-name">{p.shortName}</span>
                <span className="entry-tab-bar" aria-hidden="true">{i === current && (reduce ? <span className="entry-tab-fill is-static" /> : <span key={current} className={`entry-tab-fill ${playing ? '' : 'paused'}`} onAnimationEnd={() => { if (playing) setCurrent(c => (c + 1) % projects.length); }} />)}</span>
              </button>
            ))}
          </div>
          {!reduce && <button className="entry-play" onClick={() => setPaused(p => !p)} aria-pressed={!paused} aria-label={paused ? 'Resume project rotation' : 'Pause project rotation'}>{paused ? <Play size={12} /> : <Pause size={12} />}{paused ? 'Resume preview' : 'Pause preview'}</button>}
        </motion.div>
      </div>
      <div className="container entry-foot"><span>Electrical + Computer Engineering <span className="foot-divider">/</span> Drexel University</span><span>Finance minor <span className="foot-divider">/</span> Class of 2028</span><a href="#work">Scroll to explore <ArrowDown size={14} /></a></div>
    </section>
  );
}
