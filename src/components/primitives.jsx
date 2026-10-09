import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { X } from 'lucide-react';
import { assetUrl } from '../lib/assets.js';

/* ---------- Reveal: fade + rise on scroll ---------- */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- ScrollText: words light up as the paragraph scrolls through view ---------- */
function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <><motion.span style={{ opacity }}>{children}</motion.span>{' '}</>;
}

export function ScrollText({ text, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  if (reduce) return <p className={className}>{text}</p>;
  const words = text.split(' ');
  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
      </span>
    </p>
  );
}

/* ---------- Spotlight: card with a glow that follows the cursor ---------- */
export function Spotlight({ as: Tag = 'div', className = '', children, ...rest }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return <Tag className={`spot ${className}`} onPointerMove={onMove} {...rest}>{children}</Tag>;
}

/* ---------- CountUp: animates a number the first time it scrolls into view ---------- */
export function CountUp({ to, decimals = 0, duration = 1.4 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (reduce) { el.textContent = to.toFixed(decimals); return; }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { el.textContent = v.toFixed(decimals); } });
    return () => c.stop();
  }, [inView, to, decimals, duration, reduce]);
  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
}

/* ---------- Copy to clipboard with a short "copied" state ---------- */
export function useCopy(text) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch { window.prompt('Copy this email address:', text); }
  }, [text]);
  return [copied, copy];
}

/* ---------- Lightbox ---------- */
const LightboxCtx = createContext(() => {});
export const useLightbox = () => useContext(LightboxCtx);

export function LightboxProvider({ children }) {
  const [img, setImg] = useState(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!img) return;
    const previousFocus = img.trigger || document.activeElement;
    document.body.classList.add('no-scroll');
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setImg(null); if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', onKey); requestAnimationFrame(() => { if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true }); }); };
  }, [img]);
  return (
    <LightboxCtx.Provider value={setImg}>
      {children}
      {img && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Full-size screenshot" onClick={() => setImg(null)}>
          <button ref={closeRef} className="lightbox-close" aria-label="Close" onClick={() => setImg(null)}><X size={20} /></button>
          <div className="lightbox-scroll" onClick={(e) => e.stopPropagation()}>
            <img src={img.src} alt={img.alt} />
          </div>
        </div>
      )}
    </LightboxCtx.Provider>
  );
}

/* Image that opens in the lightbox */
export function Shot({ src, alt, full, ...rest }) {
  const open = useLightbox();
  const target = { src: assetUrl(full || src), alt };
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      decoding="async"
      loading="lazy"
      role="button"
      tabIndex={0}
      onClick={(e) => open({ ...target, trigger: e.currentTarget })}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open({ ...target, trigger: e.currentTarget }); } }}
      style={{ cursor: 'zoom-in' }}
      {...rest}
    />
  );
}

/* ---------- Browser frame ---------- */
export function Browser({ url, children, className = '' }) {
  return (
    <figure className={`browser ${className}`}>
      <figcaption className="browser-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="url">{url}</span>
      </figcaption>
      <div className="browser-body">{children}</div>
    </figure>
  );
}
