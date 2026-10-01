import { Button, Card, Input } from 'neobrutalistcomponents';

export default function Composition() {
  return (
    <Card style={{ maxWidth: 420 }}>
      <Card.Header>
        <Card.Title>Invite your team</Card.Title>
        <Card.Description>Collaborators can edit every project in this workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Input label="Work email" type="email" placeholder="ada@studio.dev" />
      </Card.Content>
      <Card.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button>Send invite</Button>
      </Card.Footer>
    </Card>
  );
}
