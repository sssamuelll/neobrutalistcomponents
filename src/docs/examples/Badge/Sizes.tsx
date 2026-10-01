import { Badge } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <Badge size="sm" variant="success">
          Live
        </Badge>
        <Badge size="md" variant="success">
          Live
        </Badge>
      </div>
      <p style={{ margin: 0 }}>
        The billing export finished <Badge size="sm">v2.4.0</Badge> and is ready to download.
      </p>
    </div>
  );
}
