import React from 'react';
import { MotionConfig } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import CommandMenu from './components/CommandMenu.jsx';
import { About, Contact, Experience, Footer, TechStrip } from './components/Sections.jsx';
import { LightboxProvider } from './components/primitives.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user"><LightboxProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Work />
        <About />
        <TechStrip />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <CommandMenu />
      {__VERCEL_ANALYTICS__ && <Analytics />}
    </LightboxProvider></MotionConfig>
  );
}
