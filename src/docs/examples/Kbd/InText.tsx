import { Kbd } from 'neobrutalistcomponents';

export default function InText() {
  return (
    <p style={{ margin: 0, maxInlineSize: 480, lineHeight: 1.8 }}>
      Press <Kbd size="sm">Esc</Kbd> to discard the draft invite, or{' '}
      <kbd style={{ font: 'inherit' }}>
        <Kbd size="sm">⌘</Kbd>+<Kbd size="sm">S</Kbd>
      </kbd>{' '}
      to save it and send it later.
    </p>
  );
}
