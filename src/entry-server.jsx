import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

// Used at build time only: tools/prerender.mjs writes this HTML into dist/index.html
export const render = () => renderToString(<App />);
