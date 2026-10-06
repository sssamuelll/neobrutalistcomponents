import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ENTRIES } from './study/data';
import { toHash } from './router';
import type { ModePref, SitePrefs } from './prefs';
import { useLang, useT } from './i18n';
import type { UIKey } from './i18n';

const MODES: { value: ModePref; label: UIKey }[] = [
  { value: 'native', label: 'modeNative' },
  { value: 'light', label: 'modeLight' },
  { value: 'dark', label: 'modeDark' },
  { value: 'system', label: 'modeSystem' },
];

interface Props {
  prefs: SitePrefs;
  onChange: (next: Partial<SitePrefs>) => void;
}

export function ThemeSwitcher({ prefs, onChange }: Props) {
  const t = useT();
  const lang = useLang();
  const entry = ENTRIES.get(prefs.theme);
  const study = entry && !entry.predatesStudy ? entry : undefined;
  return (
    <div className="site-switcher">
      <div className="site-switcher__themes" role="group" aria-label={t('themeGroup')}>
        {NEO_THEMES.map((id) => (
          <button
            key={id}
            type="button"
            className="site-swatch"
            aria-pressed={prefs.theme === id}
            title={`${THEME_INFO[id].name} — ${ENTRIES.get(id)?.tagline[lang] ?? THEME_INFO[id].tagline}`}
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
        {study ? (
          <button type="button" className="site-swatch" aria-pressed="true" title={`${study.name[lang]} — ${study.tagline[lang]}`}>
            <span className="site-swatch__chip" aria-hidden="true">
              {study.swatch.slice(0, 3).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="site-swatch__name">{study.name[lang]}</span>
          </button>
        ) : null}
        <a className="site-switcher__more" href={toHash(lang, '/atlas')}>
          {t('moreThemes')}
        </a>
      </div>
      <label className="site-switcher__mode">
        <span className="site-visually-hidden">{t('colorScheme')}</span>
        <select value={prefs.mode} onChange={(e) => onChange({ mode: e.target.value as ModePref })}>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {t(m.label)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
