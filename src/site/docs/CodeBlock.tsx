import { useMemo, useRef, useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import { Check, Copy } from 'lucide-react';
import { highlight } from './highlight';

interface CodeBlockProps {
  code: string;
  label?: string;
  /** Accessible name of the copy button; English by default. */
  copyLabel?: string;
  copiedLabel?: string;
  /** Shown when the clipboard refuses: the code is selected for the visitor to copy. */
  selectLabel?: string;
}

export function CodeBlock({ code, label = 'Code', copyLabel, copiedLabel = 'Copied', selectLabel = 'Select and copy' }: CodeBlockProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const pre = useRef<HTMLPreElement>(null);
  const tokens = useMemo(() => highlight(code.trim()), [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setState('copied');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      if (pre.current) window.getSelection()?.selectAllChildren(pre.current);
      setState('failed');
    }
  }

  const name = state === 'copied' ? copiedLabel : state === 'failed' ? selectLabel : (copyLabel ?? `Copy ${label.toLowerCase()}`);

  return (
    <div className="site-code">
      <div className="site-code__bar">
        <span className="site-code__label">{label}</span>
        <Button size="sm" variant="ghost" leftIcon={state === 'copied' ? <Check /> : <Copy />} onClick={copy} aria-label={name}>
          {state === 'failed' ? selectLabel : null}
        </Button>
      </div>
      <pre ref={pre} className="site-code__pre" tabIndex={0}>
        <code>
          {tokens.map((t, i) =>
            t.kind === 'plain' ? (
              t.text
            ) : (
              <span key={i} className={`tok-${t.kind}`}>
                {t.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
