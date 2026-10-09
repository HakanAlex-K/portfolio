import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail, Plus } from 'lucide-react';
import { profile } from '../data/profile.js';
import { assetUrl } from '../lib/assets.js';
import { Reveal, Spotlight, useCopy } from './primitives.jsx';

/* ---------- Tech marquee ---------- */
const tech = ['C', 'Python', 'TypeScript', 'Verilog', 'React', 'Node.js', 'PostgreSQL', 'TensorFlow / Keras', 'ESP32', 'Docker'];
export function TechStrip() {
  return (
    <div className="tech-strip container"><span className="eyebrow">Tools I use</span><ul aria-label="Technologies">{tech.slice(0, 10).map((t) => <li key={t}>{t}</li>)}</ul></div>
  );
}

/* ---------- About ---------- */
const principles = [
  ['Build across the stack', 'From React and Node.js to ESP32 firmware and Verilog. I like knowing how the pieces fit.'],
  ['Take responsibility after launch', 'At Blues, I owned deployment, backups, training, and support, not just the code.'],
  ['Understand the workflow', 'I work with the people using a system and turn their feedback into improvements.'],
  ['Explore intelligent systems', 'Machine learning and AI agents that work inside real processes are where I’m heading next.'],
];

export function About() {
  return (
    <section className="section" id="about">
      <div className="container about">
        <Reveal className="about-copy">
          <span className="section-kicker">02 / About</span>
          <h2>An engineer with<br /><em>a wider view.</em></h2>
          <p className="about-lede">I study Electrical and Computer Engineering at Drexel, with a Finance minor. My projects span business software, sensing, machine learning, and computer architecture.</p>
          <p>Working in a family business taught me to connect technical decisions to the people they affect.</p>
          <dl className="facts">
            <div><dt>Studying</dt><dd>B.S. Electrical + Computer Engineering · Finance minor · graduating {profile.graduation}</dd></div>
            <div><dt>Academics</dt><dd>{profile.gpa} GPA · {profile.financeGpa} Finance minor GPA · Dean’s List</dd></div>
            <div><dt>Interested in</dt><dd>AI agents · full-stack development · embedded systems</dd></div>
            <div><dt>Languages</dt><dd>English · Turkish</dd></div>
            <div><dt>Available</dt><dd>{profile.availability}</dd></div>
            <div><dt>Location</dt><dd>{profile.relocation}</dd></div>
          </dl>
        </Reveal>
        <div className="principles">
          {principles.map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <Spotlight className="principle">
                <span className="principle-number">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Experience (expandable rows) ---------- */
const experience = [
  {
    when: '2023–24 · 2025', org: 'Blues Yachting', role: 'Software Developer · Muğla, Türkiye',
    points: [
      'Built 18 modules across quoting, CRM, inventory, and payments (React, Node.js, PostgreSQL).',
      'Cut quote preparation by ~85% with automated tax calculations and one-click PDFs.',
      'Deployed with Docker; gathered requirements and trained staff.',
    ],
  },
  {
    when: '2026', org: 'Drexel Turkish Student Association', role: 'Event Coordinator · website design and build',
    points: [
      'Designed and built the association’s website, live since October 2026.',
      'Events, gallery, blog, and a guide to Türkiye.',
      'Board members manage content through a custom CMS (Next.js, TypeScript).',
    ],
  },
  {
    when: 'Mar–Jun 2025', org: 'VitalView', role: 'Team Lead · 1st place, Freshman Engineering Design',
    points: [
      'Led a wearable prototype: ESP32/PPG sensing, Node.js API, TensorFlow/Keras inference, React dashboard.',
      'Trained on 600-feature IR/red signal vectors with input validation.',
    ],
  },
  {
    when: 'Jun–Aug 2026', org: 'Hack Computer', role: 'Verilog CPU & memory system · ECE 350',
    points: [
      'Integrated ALU, registers, CPU control, and memory into a stored-program computer.',
      'Memory-mapped screen and keyboard I/O, validated with machine-language programs.',
    ],
  },
  {
    when: 'Expected Jun 2028', org: 'Drexel University', role: 'B.S. EE + CompE (double major) · Finance minor',
    points: [
      'GPA: 3.6 · Finance minor GPA: 4.0 · Dean’s List since September 2024.',
      'Coursework: Data Structures, Signals & Systems, Microcontrollers, Probability.',
      'IEEE, Drexel Chapter · Member since September 2024.',
    ],
  },
];

export function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="experience">
      <div className="container xp-layout">
        <Reveal className="section-head">
          <div><span className="section-kicker">03 / Background</span><h2>Experience<br /><em>&amp; education.</em></h2><p className="xp-intro">Production work, team projects, and coursework.</p></div>
        </Reveal>
        <Reveal className="xp">
          {experience.map((x, i) => {
            const isOpen = open === i;
            return (
              <div key={x.org} className={`xp-row ${isOpen ? 'open' : ''}`}>
                <button className="xp-head" aria-expanded={isOpen} aria-controls={`xp-panel-${i}`} id={`xp-trigger-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="xp-when mono">{x.when}</span>
                  <span className="xp-title"><strong>{x.org}</strong><span>{x.role}</span></span>
                  <Plus size={18} className="xp-icon" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      className="xp-body" id={`xp-panel-${i}`} aria-labelledby={`xp-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {x.points.map((p) => <li key={p}>{p}</li>)}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const { email, links } = profile;
  const [copied, copy] = useCopy(email);
  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <Spotlight className="contact">
            <span className="section-kicker">04 / Get in touch</span>
            <h2>Let’s talk<br /><em>engineering.</em></h2>
            <p>I’m looking for an {profile.availability} in software, AI, or embedded systems. {profile.relocation}. Get in touch to discuss a role or a project.</p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${email}`}><Mail size={16} /> Email me</a>
              <button className="btn btn-ghost" onClick={copy} aria-live="polite">{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : email}</button>
              {links.resume && <a className="btn btn-ghost" href={assetUrl(links.resume)} target="_blank" rel="noreferrer"><FileText size={16} /> Résumé <ArrowUpRight size={14} /></a>}
              {links.linkedin && <a className="btn btn-ghost" href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>}
              {links.github && <a className="btn btn-ghost" href={links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>}
            </div>
          </Spotlight>
        </Reveal>
      </div>
    </section>
  );
}

const phillyTime = () => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(new Date());

function LocalTime() {
  const [time, setTime] = useState(phillyTime);
  useEffect(() => {
    const t = setInterval(() => setTime(phillyTime()), 15000);
    return () => clearInterval(t);
  }, []);
  return <span className="footer-time"><span className="status-dot" /> Philadelphia · {time}</span>;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <LocalTime />
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
