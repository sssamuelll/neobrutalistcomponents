import { useState } from 'react';
import type { NeoTheme } from '../lib';
import { NEO_THEMES } from '../lib';
import { HeroesStrip } from './sections/HeroesStrip';
import { MatrixCanvas } from './sections/MatrixCanvas';
import { GetStarted } from './sections/GetStarted';
import './site.css';

type View = 'heroes' | NeoTheme | 'get-started';

export function App() {
  const [view, setView] = useState<View>('heroes');

  return (
    <div className="app">
      <header className="app__head">
        <div className="app__title">
          <span className="app__brand">neobrutalistcomponents</span>
          <span className="app__ver">v0.2 redesign</span>
        </div>
        <nav className="app__nav" aria-label="View">
          <button
            type="button"
            className={view === 'heroes' ? 'is-active' : ''}
            onClick={() => setView('heroes')}
          >
            Heroes
          </button>
          {NEO_THEMES.map((t) => (
            <button
              key={t}
              type="button"
              className={view === t ? 'is-active' : ''}
              onClick={() => setView(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            className={view === 'get-started' ? 'is-active' : ''}
            onClick={() => setView('get-started')}
          >
            Get started
          </button>
        </nav>
      </header>

      <main className="app__main">
        {view === 'heroes' && <HeroesStrip />}
        {view === 'get-started' && <GetStarted />}
        {view !== 'heroes' && view !== 'get-started' && (
          <div className="matrix-wrap">
            <MatrixCanvas themeId={view} />
          </div>
        )}
      </main>
    </div>
  );
}
