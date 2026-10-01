import { Progress } from 'neobrutalistcomponents';

export default function Indeterminate() {
  return (
    <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <Progress label="Provisioning database" />
      <Progress label="Waiting for DNS to propagate" variant="warning" size="sm" />
    </div>
  );
}
