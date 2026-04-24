import { Button } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function ButtonShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Button&gt;</h2>
      <p>4 variants · 3 sizes · loading · icons · fullWidth.</p>
      <div className="site-showcase-grid">
        <div>
          <div className="site-demo-row">
            <Button variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="danger">danger</Button>
            <Button variant="ghost">ghost</Button>
          </div>
          <div className="site-demo-row">
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
          </div>
          <div className="site-demo-row">
            <Button loading>loading</Button>
            <Button disabled>disabled</Button>
            <Button leftIcon="+">with icon</Button>
          </div>
          <div className="site-demo-row">
            <Button fullWidth>full width</Button>
          </div>
        </div>
        <CodeBlock>{`<Button variant="primary">Save</Button>
<Button variant="danger" size="lg">Delete</Button>
<Button loading>Submitting…</Button>
<Button leftIcon={<IconPlus />}>New</Button>
<Button fullWidth>CTA</Button>`}</CodeBlock>
      </div>
    </section>
  );
}
