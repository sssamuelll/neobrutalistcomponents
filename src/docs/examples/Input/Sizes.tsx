import { Button, Input } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 440 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          <Input size={size} label={`Size ${size}`} placeholder="Invite by email" style={{ flex: 1 }} />
          <Button size={size}>Invite</Button>
        </div>
      ))}
    </div>
  );
}
