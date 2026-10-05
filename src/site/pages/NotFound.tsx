import { Button } from 'neobrutalistcomponents';
import { useLang, useT } from '../i18n';
import { toHash } from '../router';

export function NotFound() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page site-notfound">
      <h1 className="site-h1">{t('notFoundTitle')}</h1>
      <p className="site-lead">{t('notFoundBody')}</p>
      <Button asChild>
        <a href={toHash(lang, '/')}>{t('goStudy')}</a>
      </Button>
    </div>
  );
}
