import { useT } from '../i18n';
import { SceneCards } from '../study/SceneCards';

/** Every scene of the study, and Origins. */
export function Scenes() {
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleScenes')}</h1>
        <p className="site-lead">{t('scenesLead')}</p>
      </header>
      <SceneCards heading="h2" />
    </div>
  );
}
