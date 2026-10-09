import type { Ficha } from '../../study/types';
import { useLang, useT } from '../i18n';
import { MotionSpecimen } from './MotionSpecimen';

/** The ficha's typography and motion sections; nothing when the ficha has neither. */
export function FichaExtras({ ficha }: { ficha: Ficha }) {
  const lang = useLang();
  const t = useT();
  const { lettering, motion } = ficha;
  if (!lettering && !motion) return null;
  const original = lettering?.original;
  const face = original && original.kind !== 'none' ? original : undefined;
  const facts = face ? [face.name, face.designer, face.year].filter(Boolean).join(', ') : '';
  return (
    <>
      {lettering ? (
        <>
          <h2 className="site-h2">{t('lettering')}</h2>
          {face ? (
            <>
              <p className="site-p site-themepage__lettering">
                {t('letteringOriginal')}: {facts}.
              </p>
              {lettering.documented ? <p className="site-p">{lettering.documented[lang]}</p> : null}
            </>
          ) : (
            <p className="site-p site-themepage__lettering">{t('letteringNone')}</p>
          )}
          <p className="site-p">
            {t('letteringSubstitute')}
            {face?.free ? ` ${t('letteringFree')}` : ''}: {lettering.substitute[lang]}
          </p>
        </>
      ) : null}
      {motion ? (
        <>
          <h2 className="site-h2">{t('motion')}</h2>
          <p className="site-p">{motion.documented[lang]}</p>
          <p className="site-p">{motion.reading[lang]}</p>
          <MotionSpecimen />
        </>
      ) : null}
    </>
  );
}
