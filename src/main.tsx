import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/styles.css';
import './lib/themes/classic/index.css';
import { App } from './site/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
