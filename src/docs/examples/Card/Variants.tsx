import { Card } from 'neobrutalistcomponents';

export default function Variants() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28 }}>
      <Card>
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>The resting slab.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Elevated</Card.Title>
          <Card.Description>The one that matters most.</Card.Description>
        </Card.Header>
      </Card>
      <Card variant="interactive">
        <Card.Header>
          <Card.Title>
            <a href="#/components/card">Interactive</a>
          </Card.Title>
          <Card.Description>The whole slab is a link.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}
