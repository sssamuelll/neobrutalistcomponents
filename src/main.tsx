import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The library exactly as consumers load it: core stylesheet + theme stylesheets.
// All five themes are loaded so the switcher (and the Themes page islands)
// can change instantly.
import './lib/styles.css';
import './lib/themes/classic/index.css';
import './lib/themes/tech/index.css';
import './lib/themes/swiss/index.css';
import './lib/themes/y2k/index.css';
import './lib/themes/riso/index.css';
import './site/site.css';
import { App } from './site/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
