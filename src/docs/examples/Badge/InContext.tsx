import { Badge, Card } from 'neobrutalistcomponents';
import type { BadgeProps } from 'neobrutalistcomponents';

const deploys: Array<{ service: string; branch: string; status: string; variant: BadgeProps['variant'] }> = [
  { service: 'api-gateway', branch: 'main', status: 'Live', variant: 'success' },
  { service: 'billing-worker', branch: 'fix/proration', status: 'Degraded', variant: 'warning' },
  { service: 'web-dashboard', branch: 'feat/invites', status: 'Failed', variant: 'danger' },
  { service: 'docs-site', branch: 'main', status: 'Draft', variant: 'neutral' },
];

export default function InContext() {
  return (
    <Card style={{ maxWidth: 460 }}>
      <Card.Header>
        <Card.Title>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Production
            <Badge variant="primary" size="sm">
              New
            </Badge>
          </span>
        </Card.Title>
        <Card.Description>Four services, last deployed 12 minutes ago.</Card.Description>
      </Card.Header>
      <Card.Content>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
          {deploys.map((d) => (
            <li key={d.service} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span>
                <strong>{d.service}</strong> <span style={{ opacity: 0.7 }}>{d.branch}</span>
              </span>
              <Badge variant={d.variant}>{d.status}</Badge>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
}
