import { Input } from '../../lib';
import { CodeBlock } from './CodeBlock';

export function InputShowcase() {
  return (
    <section className="site-section">
      <h2>&lt;Input&gt;</h2>
      <p>label · helperText · errorMessage · icons · 3 sizes.</p>
      <div className="site-showcase-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Email" placeholder="you@example.com" helperText="We never share." />
          <Input label="Username" defaultValue="brutalist-fan" size="lg" />
          <Input
            label="Password"
            type="password"
            variant="error"
            errorMessage="Minimum 8 characters."
          />
        </div>
        <CodeBlock>{`<Input
  label="Email"
  helperText="We never share."
  placeholder="you@example.com"
/>

<Input
  label="Password"
  type="password"
  variant="error"
  errorMessage="Minimum 8 characters."
/>`}</CodeBlock>
      </div>
    </section>
  );
}
