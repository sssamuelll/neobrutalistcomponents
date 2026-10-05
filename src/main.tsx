import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The library exactly as consumers load it: core stylesheet + theme stylesheets.
// The five core themes are always loaded, so the switcher and the atlas cards
// change instantly; study themes load on demand (src/site/study/loader.ts).
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
