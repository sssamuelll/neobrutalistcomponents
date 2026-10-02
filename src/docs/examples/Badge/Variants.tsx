import { Badge } from 'neobrutalistcomponents';

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Badge>Draft</Badge>
      <Badge variant="primary">New</Badge>
      <Badge variant="accent">Beta</Badge>
      <Badge variant="info">Synced</Badge>
      <Badge variant="success">Live</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="danger">Failed</Badge>
    </div>
  );
}
