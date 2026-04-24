import { HeroTile } from './HeroTile';
import { ThemeLabel } from './ThemeLabel';
import type { NeoTheme } from '../../lib';

type Entry = { id: NeoTheme; name: string; tagline: string };

const THEMES: readonly Entry[] = [
  { id: 'classic', name: 'CLASSIC', tagline: 'Weight · Asymmetry · Deliberate' },
  { id: 'tech',    name: 'TECH',    tagline: 'Terminal · Phosphor · Engineered' },
  { id: 'swiss',   name: 'SWISS',   tagline: 'Hairline · Grid · Oxblood' },
  { id: 'y2k',     name: 'Y2K',     tagline: 'Holo · Pill · Chromatic' },
];

export function HeroesStrip() {
  return (
    <div className="heroes">
      {THEMES.map((t, i) => (
        <div key={t.id} className="hero-wrap">
          <ThemeLabel id={t.id} index={i} name={t.name} tagline={t.tagline} />
          <HeroTile themeId={t.id} />
        </div>
      ))}
    </div>
  );
}
