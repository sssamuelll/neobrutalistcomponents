import { SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { sceneHref } from './format';
import { isPlaced, roomFacts } from './rooms';

/** The rooms as a table: the map's legend, and its keyboard and screen-reader path. */
export function RoomLegend({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void }) {
  const lang = useLang();
  const t = useT();
  return (
    <table className="world-map__legend">
      <caption className="site-visually-hidden">{t('mapLegend')}</caption>
      <thead>
        <tr>
          <th scope="col">{t('colRoom')}</th>
          <th scope="col">{t('colWorks')}</th>
          <th scope="col">{t('colYears')}</th>
        </tr>
      </thead>
      <tbody>
        {SCENES.map((scene) => {
          const { works, years } = roomFacts(scene);
          const enter = isPlaced(scene) ? () => onActive(scene) : undefined;
          const leave = isPlaced(scene) ? () => onActive(null) : undefined;
          return (
            <tr key={scene} data-active={active === scene || undefined} onPointerEnter={enter} onPointerLeave={leave}>
              <th scope="row">
                <a href={sceneHref(lang, scene)} onFocus={enter} onBlur={leave}>
                  {SCENE_TEXT[scene].name[lang]}
                </a>
                <span className="world-map__summary">{SCENE_TEXT[scene].summary[lang]}</span>
              </th>
              <td>{works}</td>
              <td>{isPlaced(scene) ? years : `${years} · ${t('noPlace')}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
