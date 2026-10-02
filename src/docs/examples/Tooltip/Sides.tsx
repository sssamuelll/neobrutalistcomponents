import { Button, Tooltip } from 'neobrutalistcomponents';

export default function Sides() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '32px 0' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} side={side} content={`Opens on the ${side}`}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  );
}
