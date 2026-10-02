import { useMemo, useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import { Check, Copy } from 'lucide-react';
import { highlight } from './highlight';

export function CodeBlock({ code, label = 'Code' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => highlight(code.trim()), [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="site-code">
      <div className="site-code__bar">
        <span className="site-code__label">{label}</span>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={copied ? <Check /> : <Copy />}
          onClick={copy}
          aria-label={copied ? 'Copied' : `Copy ${label.toLowerCase()}`}
        />
      </div>
      <pre className="site-code__pre" tabIndex={0}>
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
