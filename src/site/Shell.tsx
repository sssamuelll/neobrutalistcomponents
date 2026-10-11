import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Dialog } from 'neobrutalistcomponents';
import { MONUMENT_NAV_ID } from './home/Monument';
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

/** On the home page: true once the monument's bottom bar has scrolled above the viewport. */
function usePastMonument(home: boolean): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const target = home ? document.getElementById(MONUMENT_NAV_ID) : null;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([record]) => setPast(!record.isIntersecting && record.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, [home]);
  return home && past;
}

export function Shell({ location, prefs, onPrefsChange, children }: ShellProps) {
  const t = useT();
  const { lang, route } = location;
  const other = lang === 'es' ? 'en' : 'es';
  const englishDocs = lang === 'es' && DOCS.includes(route.name);
  const home = route.name === 'study';
  const pastMonument = usePastMonument(home);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className={home ? 'site-bar site-bar--home' : 'site-bar'} data-revealed={pastMonument ? '' : undefined}>
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
        <Button variant="secondary" size="sm" className="site-bar__menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
          {t('menuOpen')}
        </Button>
      </header>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen} size="sm" className="site-menu" closeLabel={t('menuClose')}>
        <Dialog.Header>
          <Dialog.Title>{t('menuOpen')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content
          onClick={(event) => {
            if ((event.target as Element).closest('a')) setMenuOpen(false);
          }}
        >
          <nav className="site-menu__nav" aria-label={t('navPrimary')}>
            {NAV.map((item) => (
              <a key={item.path} href={toHash(lang, item.path)} aria-current={item.match.includes(route.name) ? 'page' : undefined}>
                {t(item.key)}
              </a>
            ))}
          </nav>
          <ThemeSwitcher prefs={prefs} onChange={onPrefsChange} />
          <p className="site-menu__end">
            <a href={toHash(other, location.path, location.query)} hrefLang={other} lang={other}>
              {t('switchLanguage')}
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </p>
        </Dialog.Content>
      </Dialog>
      <main id="main" className="site-main" tabIndex={-1}>
        {englishDocs ? <p className="site-docs-note">{t('docsInEnglish')}</p> : null}
        {englishDocs ? <div lang="en">{children}</div> : children}
      </main>
      <footer className="site-footer">
        <p>
          {PACKAGE} v{pkg.version}. {t('footerNote')}
        </p>
        <nav aria-label={t('footerNav')} className="site-footer__links">
          <a href={toHash(lang, '/about')}>{t('titleAbout')}</a>
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
