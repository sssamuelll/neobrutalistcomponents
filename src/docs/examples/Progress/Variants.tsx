import { Card, Progress } from 'neobrutalistcomponents';
import type { ProgressProps } from 'neobrutalistcomponents';

const quotas: Array<{ label: string; value: number; variant: ProgressProps['variant'] }> = [
  { label: 'Storage — 34 of 100 GB', value: 34, variant: 'success' },
  { label: 'Seats — 81 of 100 used', value: 81, variant: 'warning' },
  { label: 'Build minutes — 100% used', value: 100, variant: 'danger' },
];

export default function Variants() {
  return (
    <Card style={{ maxWidth: 460 }}>
      <Card.Header>
        <Card.Title>Team plan usage</Card.Title>
        <Card.Description>Resets on November 1.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div style={{ display: 'grid', gap: 18 }}>
          {quotas.map((quota) => (
            <Progress key={quota.label} label={quota.label} value={quota.value} variant={quota.variant} showValue />
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
