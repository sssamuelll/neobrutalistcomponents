import type { EssaySlug } from '../../study/essays';
import { useLang, useT } from '../i18n';
import { useEssay } from './essays';
import { SourceList } from './SourceList';

/** A study essay and its numbered sources. The HTML was rendered at build time from the repo's own Markdown. */
export function Essay({ slug }: { slug: EssaySlug }) {
  const lang = useLang();
  const t = useT();
  const essay = useEssay(slug, lang);
  if (essay.status === 'error') {
    return (
      <p className="site-p" role="alert">
        {t('loadError')}
      </p>
    );
  }
  if (essay.status === 'loading') return <div className="study-essay study-essay--loading" aria-busy="true" />;
  const { html, sources } = essay.value;
  return (
    <div className="study-essay">
      <div className="study-essay__text" dangerouslySetInnerHTML={{ __html: html }} />
      {sources.length ? (
        <section aria-labelledby={`${slug}-sources`}>
          <h2 className="study-essay__sources" id={`${slug}-sources`}>
            {t('sources')}
          </h2>
          <SourceList sources={sources} />
        </section>
      ) : null}
    </div>
  );
}
