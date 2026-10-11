import { useT } from '../i18n';
import { Essay } from '../study/Essay';

/** The gallery's essay, which used to open the home page. */
export function About() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleAbout')}</h1>
        <p className="site-lead">{t('studyLead')}</p>
      </header>
      <Essay slug="home" />
    </div>
  );
}
