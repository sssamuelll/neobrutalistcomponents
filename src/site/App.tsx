import { useEffect, useMemo } from 'react';
import { NeoProvider } from 'neobrutalistcomponents';
import { Shell } from './Shell';
import { useSitePrefs } from './prefs';
import type { SitePrefs } from './prefs';
import { parseHash, replaceHash, useHash } from './router';
import type { Location, Route } from './router';
import { detectLang, rememberLang } from './lang';
import { LangContext, UI } from './i18n';
import type { UIKey } from './i18n';
import { SitePrefsContext } from './prefsContext';
import { useThemeStylesheet } from './study/loader';
import { Library } from './pages/Library';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Atlas } from './pages/Atlas';
import { ThemePage } from './pages/ThemePage';
import { ENTRIES } from './study/data';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
import { NotFound } from './pages/NotFound';

export type PageLocation = Extract<Location, { kind: 'page' }>;

function Page({ location }: { location: PageLocation }) {
  const { route } = location;
  switch (route.name) {
    // Until the study home exists (study plan 2, Task 8) the study route shows the library page.
    case 'study':
    case 'library':
      return <Library />;
    case 'atlas':
      return <Atlas query={location.query} />;
    case 'theme':
      return <ThemePage id={route.id} />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
      return <ComponentPage slug={route.slug} />;
    case 'blocks':
      return <Blocks />;
    case 'start':
      return <Start />;
    case 'agents':
      return <Agents />;
    default:
      return <NotFound />;
  }
}

const TITLES: Partial<Record<Route['name'], UIKey>> = {
  study: 'titleStudy',
  scenes: 'titleScenes',
  atlas: 'titleAtlas',
  origins: 'titleOrigins',
  method: 'titleMethod',
  credits: 'titleCredits',
  library: 'titleLibrary',
  components: 'titleComponents',
  blocks: 'titleBlocks',
  start: 'titleStart',
  agents: 'titleAgents',
  'not-found': 'titleNotFound',
};

function Site({ location, prefs, update }: { location: PageLocation; prefs: SitePrefs; update: (next: Partial<SitePrefs>) => void }) {
  const { lang, route } = location;
  const routeKey = `${lang}:${location.path}`;
  const status = useThemeStylesheet(prefs.theme);

  useEffect(() => {
    rememberLang(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const key = TITLES[route.name];
    const title = route.name === 'component' ? route.slug : route.name === 'theme' ? (ENTRIES.get(route.id)?.name[lang] ?? route.id) : key ? UI[key][lang] : undefined;
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents';
    window.scrollTo({ top: 0 });
  }, [routeKey, route, lang]);

  // A study theme whose stylesheet cannot load falls back to the default theme.
  useEffect(() => {
    if (status === 'error') update({ theme: 'classic' });
  }, [status, update]);

  if (status !== 'ready') {
    return (
      <p className="site-loading" role="status">
        {UI.loading[lang]}
      </p>
    );
  }

  return (
    <LangContext value={lang}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
        <Shell location={location} prefs={prefs} onPrefsChange={update}>
          <Page location={location} />
        </Shell>
      </NeoProvider>
    </LangContext>
  );
}

export function App() {
  const [prefs, update] = useSitePrefs();
  const hash = useHash();
  const location = useMemo(() => parseHash(hash, detectLang()), [hash]);
  const ctx = useMemo(() => ({ prefs, update }), [prefs, update]);

  useEffect(() => {
    if (location.kind === 'redirect') replaceHash(location.to);
  }, [location]);

  if (location.kind === 'redirect') return null;
  return (
    <SitePrefsContext value={ctx}>
      <Site location={location} prefs={prefs} update={update} />
    </SitePrefsContext>
  );
}
