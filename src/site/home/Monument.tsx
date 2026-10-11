import type { CatalogEntry } from '../../study/catalog';
import { REPO_URL } from '../../docs/guide';
import { useLang, useT } from '../i18n';
import type { UIKey } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { ModeSelect } from '../ThemeSwitcher';
import { loadThemeStylesheet } from '../study/loader';
import { FitTitle } from './FitTitle';
import { TITLE_LINES } from './fit';
import { ThemeRibbon } from './ThemeRibbon';
import { useMediaQuery } from './useMediaQuery';
import { WorkLine } from './WorkLine';

/** The id of the monument's bottom bar; the shell reveals its slim bar once this has scrolled away. */
export const MONUMENT_NAV_ID = 'monument-nav';

const SECTIONS: readonly { key: UIKey; path: string }[] = [
  { key: 'navComponents', path: '/components' },
  { key: 'navScenes', path: '/scenes' },
  { key: 'navAtlas', path: '/atlas' },
  { key: 'navLibrary', path: '/library' },
];

/** The home's first screen: one plate in the active theme with the fitted title, the ribbon, the work line and the gallery's sections. */
export function Monument({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const { prefs, update } = useSitePrefsContext();
  const phone = useMediaQuery('(max-width: 639px)');
  const other = lang === 'es' ? 'en' : 'es';
  // The stylesheet loads before the switch, so the page never drops to its loading screen.
  // A theme that cannot load leaves the site as it was.
  const pick = (id: string) => {
    loadThemeStylesheet(id).then(
      () => update({ theme: id }),
      () => undefined,
    );
  };

  return (
    <header className="monument">
      <p className="monument__corner">
        <a href={toHash(other, '/')} hrefLang={other} lang={other}>
          {t('switchLanguage')}
        </a>
        <ModeSelect mode={prefs.mode} onChange={(mode) => update({ mode })} />
      </p>
      <FitTitle key={prefs.theme} lines={TITLE_LINES[lang][phone ? 'phone' : 'wide']} label={t('monumentTitle')} className="monument__title" />
      <ThemeRibbon active={prefs.theme} onPick={pick} />
      <WorkLine entry={entry} />
      <nav id={MONUMENT_NAV_ID} className="monument__nav" aria-label={t('navGallery')}>
        {SECTIONS.map((section) => (
          <a key={section.path} href={toHash(lang, section.path)}>
            {t(section.key)}
          </a>
        ))}
        <a className="monument__repo" href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>
    </header>
  );
}
