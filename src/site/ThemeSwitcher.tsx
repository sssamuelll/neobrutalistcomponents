import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import type { ModePref, SitePrefs } from './prefs';

const MODES: { value: ModePref; label: string }[] = [
  { value: 'native', label: 'Theme default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

interface Props {
  prefs: SitePrefs;
  onChange: (next: Partial<SitePrefs>) => void;
}

export function ThemeSwitcher({ prefs, onChange }: Props) {
  return (
    <div className="site-switcher">
      <div className="site-switcher__themes" role="group" aria-label="Theme">
        {NEO_THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className="site-swatch"
            aria-pressed={prefs.theme === id}
            title={`${THEME_INFO[id].name} — ${THEME_INFO[id].tagline}`}
            onClick={() => onChange({ theme: id })}
          >
            <span className="site-swatch__chip" aria-hidden="true">
              {THEME_INFO[id].swatch.slice(0, 3).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="site-swatch__name">{THEME_INFO[id].name}</span>
          </button>
        ))}
      </div>
      <label className="site-switcher__mode">
        <span className="site-visually-hidden">Color scheme</span>
        <select value={prefs.mode} onChange={(e) => onChange({ mode: e.target.value as ModePref })}>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
