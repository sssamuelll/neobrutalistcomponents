import { useRef, useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { CodeBlock } from '../docs/CodeBlock';
import { fill, useLang, useT } from '../i18n';
import { INSTALL_COMMAND, installCode } from '../install';
import { toHash } from '../router';
import { loadDetail, useThemeDetail } from '../study/detail';
import { useNearViewport } from '../study/useNearViewport';
import { copyProps } from './copyLabels';
import { tokensCss } from './works';

/** «Copiar CSS»: the theme's tokens as one rule. */
function CopyCss({ entry, tokens }: { entry: CatalogEntry; tokens: ReadonlyMap<string, string> | null }) {
  const t = useT();
  const [css, setCss] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copyCss() {
    try {
      // With the tokens already here the write happens within the click: Safari allows clipboard writes only during the gesture.
      const ready = tokens ?? (await loadDetail(entry)).tokens;
      await navigator.clipboard.writeText(tokensCss(entry.id, ready));
      setCss('copied');
    } catch {
      setCss('failed');
    }
  }

  return (
    <Button variant="secondary" onClick={copyCss}>
      {t(css === 'copied' ? 'cssCopied' : css === 'failed' ? 'cssFailed' : 'copyCss')}
    </Button>
  );
}

function LoadedCopyCss({ entry }: { entry: CatalogEntry }) {
  const data = useThemeDetail(entry);
  return <CopyCss entry={entry} tokens={data.status === 'ready' ? data.value.tokens : null} />;
}

/** How to take the active theme: the install command, its import lines, and its tokens as CSS. */
export function TakeIt({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const near = useNearViewport(ref);

  return (
    <section ref={ref} className="take-it" aria-labelledby="take-it-title">
      <h2 className="site-h2" id="take-it-title">
        {t('takeHeading')}
      </h2>
      <p className="site-lead">{fill(t('takeLead'), { name: entry.name[lang] })}</p>
      <CodeBlock code={INSTALL_COMMAND} {...copyProps(t, 'Shell')} />
      <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} {...copyProps(t, 'TSX')} />
      <p className="take-it__actions">
        {near ? <LoadedCopyCss entry={entry} /> : <CopyCss entry={entry} tokens={null} />}
        <a href={toHash(lang, '/agents')}>
          {t('agentsLink')}
          <span aria-hidden="true"> →</span>
        </a>
      </p>
    </section>
  );
}
