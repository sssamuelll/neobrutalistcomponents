import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './site/App';

// Load tokens FIRST so :root vars (spacing, font-sizes, safe defaults) are
// defined before any component CSS resolves them. The lib's index.ts already
// does `import './tokens.css'` but Vite was tree-shaking that side-effect
// import in the site build, leaving --nbc-space-* undefined → all paddings
// collapsed to 0. Importing it directly here makes the dependency explicit.
import './lib/tokens.css';

// Then load all four themes so the switcher can swap instantly.
import './lib/themes/classic.css';
import './lib/themes/tech.css';
import './lib/themes/swiss.css';
import './lib/themes/y2k.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
