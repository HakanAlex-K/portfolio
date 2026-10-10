import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { profile } from '../data/profile.js';
import { assetUrl } from '../lib/assets.js';
import { openCommandMenu } from './CommandMenu.jsx';

const links = [['work', 'Work'], ['about', 'About'], ['experience', 'Experience'], ['contact', 'Contact']];

export default function Nav() {
  const [active, setActive] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { scrollYProgress } = useScroll();
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);
  useEffect(() => {
    const onScroll = () => {
      setPastHero((document.getElementById('top')?.getBoundingClientRect().bottom ?? 0) < 100);
      setAtTop(window.scrollY < 8);
      let current = null;
      for (const [id] of links) if (document.getElementById(id)?.getBoundingClientRect().top <= 180) current = id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (e.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus(); } };
    const outside = (e) => { if (!e.target.closest('.nav')) setMenuOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [menuOpen]);
  return (
    <header className={`nav ${pastHero ? 'scrolled' : 'over-hero'} ${atTop ? 'at-top' : ''}`}>
      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <div className="nav-inner">
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)} aria-label={`${profile.name}, back to top`}><span className="brand-mark">h<span>.</span></span><span className="brand-name">{profile.name}</span></a>
        <nav className="nav-links" aria-label="Primary">{links.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} className={active === id ? 'is-active' : ''}>{label}</a>)}</nav>
        <div className="nav-right">
          <button className="kbd-btn" onClick={openCommandMenu} aria-label="Open command menu"><Search size={17} /><span className="shortcut-hint">{isMac ? '⌘' : 'Ctrl'} K</span></button>
          {profile.links.resume && <a className="btn btn-sm btn-light nav-resume" href={assetUrl(profile.links.resume)} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14} /></a>}
          <button id="menu-toggle" className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">{links.map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}<button onClick={() => { setMenuOpen(false); openCommandMenu(); }}>Search this site <kbd>Ctrl / ⌘ K</kbd></button></nav>}
    </header>
  );
}
