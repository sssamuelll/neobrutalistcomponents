import { Button, Card } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function CardShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Card&gt;</h2>
      <p>Composable. default · elevated · interactive.</p>
      <div className="site-showcase-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card variant="default">
            <Card.Header>
              <Card.Title>Plan Free</Card.Title>
              <Card.Description>Starter tier.</Card.Description>
            </Card.Header>
            <Card.Content>Basic features, no card required.</Card.Content>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Plan Pro</Card.Title>
              <Card.Description>$29 / mo</Card.Description>
            </Card.Header>
            <Card.Content>Everything in Free, plus advanced features.</Card.Content>
            <Card.Footer>
              <Button>Subscribe</Button>
            </Card.Footer>
          </Card>

          <Card variant="interactive">
            <Card.Header>
              <Card.Title>Interactive</Card.Title>
              <Card.Description>Hover me.</Card.Description>
            </Card.Header>
            <Card.Content>Click targets wrap this yourself.</Card.Content>
          </Card>
        </div>
        <CodeBlock>{`<Card variant="elevated">
  <Card.Header>
    <Card.Title>Plan Pro</Card.Title>
    <Card.Description>$29 / mo</Card.Description>
  </Card.Header>
  <Card.Content>Everything in Free, plus advanced features.</Card.Content>
  <Card.Footer>
    <Button>Subscribe</Button>
  </Card.Footer>
</Card>`}</CodeBlock>
      </div>
    </section>
  );
}
