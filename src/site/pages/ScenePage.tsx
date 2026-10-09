import { SCENES } from '../../study/types';
import type { Scene } from '../../study/types';
import type { EssaySlug } from '../../study/essays';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { toHash } from '../router';
import { CATALOG } from '../study/data';
import { Essay } from '../study/Essay';
import { startYear } from '../study/format';
import { SceneCards } from '../study/SceneCards';
import { ThemeCard } from '../study/ThemeCard';

const ESSAYS: Record<Scene, EssaySlug> = {
  japan: 'scene-japan',
  germany: 'scene-germany',
  usa: 'scene-usa',
  latam: 'scene-latam',
  italy: 'scene-italy',
  origins: 'origins',
};

/** A scene (or Origins): its essay, its references in date order with their themes, and the other scenes. */
export function ScenePage({ scene }: { scene: Scene }) {
  const lang = useLang();
  const t = useT();
  const themes = CATALOG.filter((entry) => entry.scene === scene).sort(
    (a, b) => startYear(a.reference.date) - startYear(b.reference.date) || (a.id < b.id ? -1 : 1),
  );
  return (
    <div className="site-page study-scene">
      <p className="site-doc__crumbs">
        <a href={toHash(lang, '/scenes')}>{t('titleScenes')}</a>
      </p>
      <header className="site-page__head">
        <h1 className="site-h1">{SCENE_TEXT[scene].name[lang]}</h1>
        <p className="site-lead">{SCENE_TEXT[scene].summary[lang]}</p>
      </header>

      <Essay slug={ESSAYS[scene]} />

      <section className="study-section" aria-labelledby="scene-themes">
        <h2 className="site-h2" id="scene-themes">
          {t(scene === 'origins' ? 'originsThemes' : 'timelineHeading')}
        </h2>
        <ol className="study-timeline">
          {themes.map((entry) => (
            <li key={entry.id} className="study-timeline__item">
              <p className="study-timeline__year">{startYear(entry.reference.date)}</p>
              <ThemeCard entry={entry} as="div" />
            </li>
          ))}
        </ol>
      </section>

      <nav className="study-section" aria-labelledby="scene-others">
        <h2 className="site-h2" id="scene-others">
          {t('otherScenes')}
        </h2>
        <SceneCards scenes={SCENES.filter((other) => other !== scene)} />
      </nav>
    </div>
  );
}
