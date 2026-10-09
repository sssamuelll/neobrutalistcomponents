import { useState } from 'react';
import type { ThemeScene } from '../../study/types';
import { useT } from '../i18n';
import { plateStyle } from '../study/map-colors';
import { RoomLegend } from '../study/RoomLegend';
import { WorldMap } from '../study/WorldMap';

const PLATE_STYLE = plateStyle();

/** Every room of the study on a world map, with Origins in the legend. */
export function Scenes() {
  const t = useT();
  const [active, setActive] = useState<ThemeScene | null>(null);
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleScenes')}</h1>
        <p className="site-lead">{t('scenesLead')}</p>
      </header>
      <figure className="world-map" style={PLATE_STYLE} data-active={active ?? undefined}>
        <WorldMap active={active} onActive={setActive} />
        <RoomLegend active={active} onActive={setActive} />
        <figcaption className="world-map__caption">
          {t('mapCaption')} ·{' '}
          <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
            Natural Earth 1:110m
          </a>
        </figcaption>
      </figure>
    </div>
  );
}
