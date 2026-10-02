import { Badge, Card } from 'neobrutalistcomponents';

const projects = [
  { slug: 'acme-relaunch', name: 'Acme relaunch', due: 'Due Friday', status: 'On track' },
  { slug: 'atlas-api', name: 'Atlas API v2', due: 'Due in 3 weeks', status: 'At risk' },
];

export default function Interactive() {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
      {projects.map((p) => (
        <Card key={p.slug} as="li" variant="interactive">
          <Card.Header>
            <Card.Title>
              <a href={`#/projects/${p.slug}`}>{p.name}</a>
            </Card.Title>
            <Card.Description>{p.due}</Card.Description>
          </Card.Header>
          <Card.Content>
            <Badge variant={p.status === 'At risk' ? 'warning' : 'success'}>{p.status}</Badge>
          </Card.Content>
        </Card>
      ))}
    </ul>
  );
}
