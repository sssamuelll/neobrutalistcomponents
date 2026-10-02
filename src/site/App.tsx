import { useEffect, useMemo } from 'react';
import { NeoProvider } from 'neobrutalistcomponents';
import { Shell } from './Shell';
import { useSitePrefs } from './prefs';
import { useRoute } from './router';
import { Home } from './pages/Home';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { Themes } from './pages/Themes';
import { Blocks } from './pages/Blocks';
import { Start } from './pages/Start';
import { Agents } from './pages/Agents';
import { NotFound } from './pages/NotFound';
import type { Route } from './router';
import { SitePrefsContext } from './prefsContext';

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'components':
      return <ComponentsIndex />;
    case 'component':
      return <ComponentPage slug={route.slug} />;
    case 'themes':
      return <Themes />;
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

const TITLES: Partial<Record<Route['name'], string>> = {
  components: 'Components',
  themes: 'Themes',
  blocks: 'Blocks',
  start: 'Get started',
  agents: 'For agents',
};

export function App() {
  const [prefs, setPrefs] = useSitePrefs();
  const route = useRoute();
  const routeKey = route.name === 'component' ? `component:${route.slug}` : route.name;

  useEffect(() => {
    const title = route.name === 'component' ? route.slug : TITLES[route.name];
    document.title = title ? `${title} — neobrutalistcomponents` : 'neobrutalistcomponents — components that hold their shape';
    window.scrollTo({ top: 0 });
  }, [routeKey, route]);

  const ctx = useMemo(() => ({ prefs, update: setPrefs }), [prefs, setPrefs]);

  return (
    <SitePrefsContext value={ctx}>
      <NeoProvider theme={prefs.theme} mode={prefs.mode === 'native' ? undefined : prefs.mode}>
        <Shell route={route} prefs={prefs} onPrefsChange={setPrefs}>
          <Page route={route} />
        </Shell>
      </NeoProvider>
    </SitePrefsContext>
  );
}
