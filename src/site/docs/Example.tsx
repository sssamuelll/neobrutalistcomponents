import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Button } from 'neobrutalistcomponents';
import { Code2 } from 'lucide-react';
import { useLang } from '../i18n';
import { parseHash } from '../router';
import { CodeBlock } from './CodeBlock';
import type { Source } from './registry';

/**
 * Example code links to the site's pages without a language (`#/start`), the
 * way it is meant to be pasted. On the site each of those links carries the
 * reader's language, so following it never goes through a redirect.
 */
function useLinksInLanguage(stage: RefObject<HTMLElement | null>) {
  const lang = useLang();
  useLayoutEffect(() => {
    for (const link of stage.current?.querySelectorAll('a[href^="#/"]') ?? []) {
      const location = parseHash(link.getAttribute('href') ?? '', lang);
      if (location.kind === 'redirect') link.setAttribute('href', location.to);
    }
  });
}

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
  const stage = useRef<HTMLDivElement>(null);
  useLinksInLanguage(stage);
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
      <div ref={stage} className={bleed ? 'site-example__stage site-example__stage--bleed' : 'site-example__stage'}>
        <Component />
      </div>
      {showCode && <CodeBlock code={code} label="TSX" />}
    </section>
  );
}
