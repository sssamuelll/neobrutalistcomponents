import { CodeBlock } from './CodeBlock';

export function QuickStart() {
  return (
    <section className="site-section" id="quick-start">
      <h2>Quick start</h2>
      <div className="site-showcase-grid">
        <div>
          <h3>Install</h3>
          <CodeBlock>npm install neobrutalistcomponents</CodeBlock>
        </div>
        <div>
          <h3>Use</h3>
          <CodeBlock>{`import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';

<NeoProvider theme="classic">
  <Button>Hello</Button>
</NeoProvider>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
