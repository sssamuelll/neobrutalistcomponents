import { Card } from 'neobrutalistcomponents';
import { SCENES } from '../../study/types';
import type { Scene } from '../../study/types';
import { SCENE_TEXT, themeCount, useLang } from '../i18n';
import { CATALOG } from './data';
import { sceneHref } from './format';

/** The four scenes and Origins as cards, each with a dot per theme (its primary colour). */
export function SceneCards({ scenes = SCENES, heading = 'h3' }: { scenes?: readonly Scene[]; heading?: 'h2' | 'h3' }) {
  const lang = useLang();
  return (
    <ul className="study-scenes">
      {scenes.map((scene) => {
        const themes = CATALOG.filter((entry) => entry.scene === scene);
        return (
          <Card key={scene} as="li" variant="interactive" className="study-scenes__card">
            <Card.Header>
              <Card.Title as={heading}>
                <a href={sceneHref(lang, scene)}>{SCENE_TEXT[scene].name[lang]}</a>
              </Card.Title>
              <Card.Description>{SCENE_TEXT[scene].summary[lang]}</Card.Description>
            </Card.Header>
            <Card.Footer className="study-scenes__foot">
              <span className="study-scenes__dots" aria-hidden="true">
                {themes.map((entry) => (
                  <span key={entry.id} style={{ background: entry.swatch[0] }} />
                ))}
              </span>
              <span>{themeCount(lang, themes.length)}</span>
            </Card.Footer>
          </Card>
        );
      })}
    </ul>
  );
}
