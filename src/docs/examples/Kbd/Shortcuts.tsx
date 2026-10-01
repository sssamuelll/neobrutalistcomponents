import { Kbd } from 'neobrutalistcomponents';

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Search projects' },
  { keys: ['⌘', '⏎'], label: 'Deploy to production' },
  { keys: ['Shift', '?'], label: 'Show shortcuts' },
  { keys: ['Esc'], label: 'Close panel' },
];

export default function Shortcuts() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12, maxInlineSize: 360 }}>
      {shortcuts.map(({ keys, label }) => (
        <li key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <span>{label}</span>
          <kbd style={{ display: 'inline-flex', gap: 4, font: 'inherit' }}>
            {keys.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </kbd>
        </li>
      ))}
    </ul>
  );
}
