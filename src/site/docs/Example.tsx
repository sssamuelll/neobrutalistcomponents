import { useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import { Code2 } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import type { Source } from './registry';

interface ExampleProps {
  title: string;
  description?: string;
  source: Source;
  /** Wide previews (blocks) drop the inner padding. */
  bleed?: boolean;
  id?: string;
}

export function Example({ title, description, source, bleed, id }: ExampleProps) {
  const [showCode, setShowCode] = useState(false);
  const { Component, code } = source;
  return (
    <section className="site-example" aria-labelledby={id ? `${id}-title` : undefined} id={id}>
      <header className="site-example__head">
        <div>
          <h3 className="site-example__title" id={id ? `${id}-title` : undefined}>
            {title}
          </h3>
          {description && <p className="site-example__desc">{description}</p>}
        </div>
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Code2 />}
          aria-expanded={showCode}
          onClick={() => setShowCode((v) => !v)}
        >
          {showCode ? 'Hide code' : 'Show code'}
        </Button>
      </header>
      <div className={bleed ? 'site-example__stage site-example__stage--bleed' : 'site-example__stage'}>
        <Component />
      </div>
      {showCode && <CodeBlock code={code} label="TSX" />}
    </section>
  );
}
