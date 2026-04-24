import { NEO_THEMES } from '../../lib';
import type { NeoTheme } from '../../lib';

export function Nav({
  current,
  onChange,
}: {
  current: NeoTheme;
  onChange: (theme: NeoTheme) => void;
}) {
  return (
    <nav className="site-nav">
      <a href="/" className="site-nav__brand">
        neobrutalistcomponents
        <span className="site-nav__version">v0.1.0</span>
      </a>
      <div className="site-nav__themes">
        {NEO_THEMES.map((t) => (
          <button
            key={t}
            type="button"
            className="site-nav__theme-chip"
            data-active={t === current}
            aria-pressed={t === current}
            aria-label={`Switch to ${t} theme`}
            onClick={() => onChange(t)}
          >
            {t}
          </button>
        ))}
        <a
          href="https://github.com/sssamuelll/neobrutalistcomponents"
          className="site-nav__theme-chip"
          target="_blank"
          rel="noreferrer"
        >
          github ↗
        </a>
      </div>
    </nav>
  );
}
