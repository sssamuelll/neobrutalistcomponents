import { THEME_SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { SCENE_TEXT, useLang, workCount } from '../i18n';
import { sceneHref } from './format';
import { roomFacts } from './rooms';
import { MAP_GRATICULE, MAP_LAND, MAP_ROOMS, MAP_SIZE } from './world-map.generated';

const [COLS, ROWS] = MAP_SIZE;

/** One dot per grid cell: a square 0.6 units wide, centred in its 1-unit cell. */
function Dots({ id, fill }: { id: string; fill: string }) {
  return (
    <pattern id={id} width="1" height="1" patternUnits="userSpaceOnUse">
      <rect x="0.2" y="0.2" width="0.6" height="0.6" style={{ fill }} />
    </pattern>
  );
}

/**
 * The rooms on a dot map. For pointer and touch only: hidden from assistive
 * technology and out of the tab order, because the legend carries the same
 * links and highlights the same regions on focus.
 */
export function WorldMap({ active, onActive }: { active: ThemeScene | null; onActive: (scene: ThemeScene | null) => void }) {
  const lang = useLang();
  return (
    <svg className="world-map__svg" viewBox={`0 0 ${COLS} ${ROWS}`} aria-hidden="true" focusable="false">
      <defs>
        <Dots id="world-map-land" fill="var(--map-land)" />
        {THEME_SCENES.map((scene) => (
          <Dots key={scene} id={`world-map-${scene}`} fill={`var(--map-room-${scene})`} />
        ))}
      </defs>
      <path className="world-map__graticule" d={MAP_GRATICULE} />
      <path d={MAP_LAND} fill="url(#world-map-land)" />
      {THEME_SCENES.map((scene) => {
        const room = MAP_ROOMS[scene];
        const { works, years } = roomFacts(scene);
        const [ax, ay] = room.anchor;
        const [lx, ly] = room.label;
        return (
          <a
            key={scene}
            className="world-map__room"
            data-scene={scene}
            data-active={active === scene || undefined}
            href={sceneHref(lang, scene)}
            tabIndex={-1}
            onPointerEnter={() => onActive(scene)}
            onPointerLeave={() => onActive(null)}
          >
            <path d={room.path} fill={`url(#world-map-${scene})`} />
            <g className="world-map__label">
              <line x1={ax} y1={ay} x2={lx} y2={ly + 0.7} />
              <circle cx={ax} cy={ay} r="0.6" />
              <text x={lx} y={ly}>
                {SCENE_TEXT[scene].name[lang]}
              </text>
              <text className="world-map__facts" x={lx} y={ly + 2.6}>
                {`${workCount(lang, works)} · ${years} · ${room.coords}`}
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}
