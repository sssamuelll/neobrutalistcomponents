import type { ReactNode } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { SitePrefs } from './prefs';
import type { Route } from './router';
import { PACKAGE, REPO_URL } from '../docs/guide';

const NAV: { label: string; path: string; match: Route['name'][] }[] = [
  { label: 'Components', path: '/components', match: ['components', 'component'] },
  { label: 'Themes', path: '/themes', match: ['themes'] },
  { label: 'Blocks', path: '/blocks', match: ['blocks'] },
  { label: 'Start', path: '/start', match: ['start'] },
  { label: 'Agents', path: '/agents', match: ['agents'] },
];

interface ShellProps {
  route: Route;
  prefs: SitePrefs;
  onPrefsChange: (next: Partial<SitePrefs>) => void;
  children: ReactNode;
}

export function Shell({ route, prefs, onPrefsChange, children }: ShellProps) {
  return (
    <div className="site">
      <a
        className="site-skip"
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-bar">
        <a className="site-brand" href="#/" aria-label={`${PACKAGE} home`}>
          <span className="site-brand__mark" aria-hidden="true">
            nb
          </span>
          <span className="site-brand__name">neobrutalist­components</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className="site-nav__link"
              aria-current={item.match.includes(route.name) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="site-bar__end">
          <ThemeSwitcher prefs={prefs} onChange={onPrefsChange} />
          <a className="site-bar__repo" href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>
      <main id="main" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <p>
          {PACKAGE} v1.0.0. MIT licensed. Built with its own components — switch the theme above and this page changes
          with it.
        </p>
        <nav aria-label="Footer" className="site-footer__links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`https://www.npmjs.com/package/${PACKAGE}`} target="_blank" rel="noreferrer">
            npm
          </a>
          <a href="llms.txt">llms.txt</a>
          <a href="llms-full.txt">llms-full.txt</a>
        </nav>
      </footer>
    </div>
  );
}
