import type { ReactNode } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { SitePrefs } from './prefs';
import { toHash } from './router';
import type { Route } from './router';
import type { PageLocation } from './App';
import { useT } from './i18n';
import type { UIKey } from './i18n';
import { PACKAGE, REPO_URL } from '../docs/guide';
import pkg from '../../package.json';

const NAV: { key: UIKey; path: string; match: Route['name'][] }[] = [
  { key: 'navStudy', path: '/', match: ['study'] },
  { key: 'navScenes', path: '/scenes', match: ['scenes', 'scene', 'origins'] },
  { key: 'navAtlas', path: '/atlas', match: ['atlas', 'theme'] },
  { key: 'navLibrary', path: '/library', match: ['library', 'blocks', 'start', 'agents'] },
  { key: 'navComponents', path: '/components', match: ['components', 'component'] },
];

/** The library's technical documentation, which stays in English in both languages. */
const DOCS: Route['name'][] = ['library', 'components', 'component', 'blocks', 'start', 'agents'];

interface ShellProps {
  location: PageLocation;
  prefs: SitePrefs;
  onPrefsChange: (next: Partial<SitePrefs>) => void;
  children: ReactNode;
}

export function Shell({ location, prefs, onPrefsChange, children }: ShellProps) {
  const t = useT();
  const { lang, route } = location;
  const other = lang === 'es' ? 'en' : 'es';
  const englishDocs = lang === 'es' && DOCS.includes(route.name);

  return (
    <div className="site">
      <a
        className="site-skip"
        href={toHash(lang, location.path)}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        {t('skip')}
      </a>
      <header className="site-bar">
        <a className="site-brand" href={toHash(lang, '/')} aria-label={t('brandHome')}>
          <span className="site-brand__mark" aria-hidden="true">
            nb
          </span>
          <span className="site-brand__name">neobrutalist­components</span>
        </a>
        <nav className="site-nav" aria-label={t('navPrimary')}>
          {NAV.map((item) => (
            <a
              key={item.path}
              href={toHash(lang, item.path)}
              className="site-nav__link"
              aria-current={item.match.includes(route.name) ? 'page' : undefined}
            >
              {t(item.key)}
            </a>
          ))}
        </nav>
        <div className="site-bar__end">
          <ThemeSwitcher prefs={prefs} onChange={onPrefsChange} />
          <a className="site-bar__lang" href={toHash(other, location.path, location.query)} hrefLang={other} lang={other}>
            {t('switchLanguage')}
          </a>
          <a className="site-bar__repo" href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </header>
      <main id="main" className="site-main" tabIndex={-1}>
        {englishDocs ? <p className="site-docs-note">{t('docsInEnglish')}</p> : null}
        {englishDocs ? <div lang="en">{children}</div> : children}
      </main>
      <footer className="site-footer">
        <p>
          {PACKAGE} v{pkg.version}. {t('footerNote')}
        </p>
        <nav aria-label={t('footerNav')} className="site-footer__links">
          <a href={toHash(lang, '/credits')}>{t('footerCredits')}</a>
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
