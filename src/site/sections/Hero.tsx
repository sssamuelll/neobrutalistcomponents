import { useState } from 'react';
import { Button } from '../../lib';

const GITHUB_URL =
  'https://github.com/sssamuelll/neobrutalistcomponents';

export function Hero() {
  const [count, setCount] = useState(0);
  return (
    <section className="site-section">
      <h2>Brutalist components. Four flavors. One switch.</h2>
      <p>React 19 · CSS variables · SSR-safe · ~8 kB gz.</p>
      <div className="site-demo-row">
        <Button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const el = document.getElementById('quick-start');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Docs
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.open(GITHUB_URL, '_blank', 'noopener')}
        >
          View source ↗
        </Button>
      </div>
    </section>
  );
}
