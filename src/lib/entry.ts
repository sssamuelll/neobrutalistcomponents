// Build entry for the library bundle: pulls the stylesheet into the Vite graph
// (emitted as dist/styles.css) without leaking a CSS import into index.d.ts.
import './styles.css';

export * from './index';
