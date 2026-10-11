import { useState } from 'react';
import { Button } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { CodeBlock } from '../docs/CodeBlock';
import { fill, useLang, useT } from '../i18n';
import { INSTALL_COMMAND, installCode } from '../install';
import { toHash } from '../router';
import { loadDetail } from '../study/detail';
import { copyProps } from './copyLabels';
import { tokensCss } from './works';

/** How to take the active theme: the install command, its import lines, and its tokens as CSS. */
export function TakeIt({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  const t = useT();
  const [css, setCss] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copyCss() {
    try {
      const detail = await loadDetail(entry);
      await navigator.clipboard.writeText(tokensCss(entry.id, detail.tokens));
      setCss('copied');
    } catch {
      setCss('failed');
    }
  }

  return (
    <section className="take-it" aria-labelledby="take-it-title">
      <h2 className="site-h2" id="take-it-title">
        {t('takeHeading')}
      </h2>
      <p className="site-lead">{fill(t('takeLead'), { name: entry.name[lang] })}</p>
      <CodeBlock code={INSTALL_COMMAND} {...copyProps(t, 'Shell')} />
      <CodeBlock code={installCode(entry.id, entry.fonts.length > 0)} {...copyProps(t, 'TSX')} />
      <p className="take-it__actions">
        <Button variant="secondary" onClick={copyCss}>
          {t(css === 'copied' ? 'cssCopied' : css === 'failed' ? 'cssFailed' : 'copyCss')}
        </Button>
        <a href={toHash(lang, '/agents')}>
          {t('agentsLink')}
          <span aria-hidden="true"> →</span>
        </a>
      </p>
    </section>
  );
}
