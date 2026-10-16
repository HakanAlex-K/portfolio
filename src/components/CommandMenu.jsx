import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Copy, Cpu, FileText, Github, GraduationCap, Hash, Linkedin, Mail, Search, Ship, User, Users } from 'lucide-react';
import { profile } from '../data/profile.js';
import { assetUrl } from '../lib/assets.js';

export const openCommandMenu = () => window.dispatchEvent(new Event('cmdk:open'));

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
const open = (url) => window.open(url, '_blank', 'noopener');

function useCommands(onCopied) {
  return useMemo(() => {
    const { links, email } = profile;
    return [
      { group: 'Navigate', label: 'Selected work', icon: Hash, run: () => go('work') },
      { group: 'Navigate', label: 'Blues Yachting platform', icon: Ship, run: () => go('blues') },
      { group: 'Navigate', label: 'UniTR university explorer + AI search', icon: GraduationCap, run: () => go('unitr') },
      { group: 'Navigate', label: 'VitalView research dashboard', icon: Cpu, run: () => go('vitalview') },
      { group: 'Navigate', label: 'Drexel Turkish Student Association website', icon: Users, run: () => go('drexel-tsa') },
      { group: 'Navigate', label: 'About me', icon: User, run: () => go('about') },
      { group: 'Navigate', label: 'Experience', icon: FileText, run: () => go('experience') },
      { group: 'Navigate', label: 'Contact', icon: Mail, run: () => go('contact') },
      { group: 'Actions', label: 'Copy email address', hint: email, icon: Copy, run: () => { navigator.clipboard?.writeText(email).then(onCopied, () => {}); } },
      { group: 'Actions', label: 'Send an email', icon: Mail, run: () => { window.location.href = `mailto:${email}`; } },
      links.resume && { group: 'Actions', label: 'Open resume (PDF)', icon: FileText, run: () => open(assetUrl(links.resume)) },
      { group: 'Links', label: 'VitalView live demo', hint: 'hakanalex-k.github.io/vitalview', icon: Cpu, run: () => open('https://hakanalex-k.github.io/vitalview/') },
      { group: 'Links', label: 'VitalView source on GitHub', icon: Github, run: () => open('https://github.com/HakanAlex-K/vitalview') },
      { group: 'Links', label: 'Drexel TSA website (live)', hint: 'drexeltsa.vercel.app', icon: Users, run: () => open('https://drexeltsa.vercel.app') },
      links.github && { group: 'Links', label: 'GitHub', icon: Github, run: () => open(links.github) },
      links.linkedin && { group: 'Links', label: 'LinkedIn', icon: Linkedin, run: () => open(links.linkedin) },
    ].filter(Boolean);
  }, [onCopied]);
}

export default function CommandMenu() {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const commands = useCommands(useMemo(() => () => { setToast(true); setTimeout(() => setToast(false), 1800); }, []));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.group} ${c.hint || ''}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === '/' && !isOpen && !/input|textarea|select/i.test(document.activeElement?.tagName) && !document.activeElement?.isContentEditable && !document.querySelector('.lightbox')) { e.preventDefault(); setOpen(true); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('cmdk:open', onOpen); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    setQuery(''); setActive(0);
    document.body.classList.add('no-scroll');
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => { clearTimeout(t); document.body.classList.remove('no-scroll'); previousFocus?.focus({ preventScroll: true }); };
  }, [isOpen]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => { listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' }); }, [active]);

  const run = (cmd) => { setOpen(false); setTimeout(cmd.run, 60); };
  const onKeyDown = (e) => {
    if (e.key === 'Tab') { e.preventDefault(); inputRef.current?.focus(); }
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); run(results[active]); }
  };

  let lastGroup = null;
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="cmdk-overlay" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <motion.div
              className="cmdk" role="dialog" aria-modal="true" aria-label="Command menu"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cmdk-input">
                <Search size={17} />
                <input
                  ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown}
                  placeholder="Where to? Type a command or search…" aria-label="Search commands"
                  role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" aria-activedescendant={results[active] ? `cmdk-${active}` : undefined}
                />
                <kbd>esc</kbd>
              </div>
              <ul className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
                {results.length === 0 && <li className="cmdk-empty">No results for “{query}”</li>}
                {results.map((c, i) => {
                  const Icon = c.icon;
                  const header = c.group !== lastGroup ? (lastGroup = c.group) : null;
                  return (
                    <React.Fragment key={c.label}>
                      {header && <li className="cmdk-group" role="presentation">{header}</li>}
                      <li
                        id={`cmdk-${i}`} role="option" aria-selected={i === active} data-active={i === active}
                        className="cmdk-item" onMouseMove={() => setActive(i)} onClick={() => run(c)}
                      >
                        <Icon size={16} />
                        <span>{c.label}</span>
                        {c.hint && <small>{c.hint}</small>}
                        <ArrowRight size={14} className="cmdk-go" />
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
              <div className="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
