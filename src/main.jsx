import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/site.css';
import './styles/worlds.css';

const root = document.getElementById('root');
const app = <React.StrictMode><App /></React.StrictMode>;

// Production HTML is pre-rendered (tools/prerender.mjs); the dev server's is empty
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
