import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './site/App';

// Load all four themes upfront so the switcher can swap instantly.
import './lib/themes/classic.css';
import './lib/themes/tech.css';
import './lib/themes/swiss.css';
import './lib/themes/y2k.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
