import type { NeoTheme } from '../../lib';

type Props = { id: NeoTheme; index: number; name: string; tagline: string };

export function ThemeLabel({ id, index, name, tagline }: Props) {
  return (
    <div className="theme-label">
      <div className="theme-label__bar">
        <span className="theme-label__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="theme-label__dot" data-theme-dot={id} />
        <span className="theme-label__name">{name}</span>
      </div>
      <div className="theme-label__tagline">{tagline}</div>
    </div>
  );
}
