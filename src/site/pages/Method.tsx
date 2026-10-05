import { CONTRAST_PAIRS } from '../../lib/themes/contract';
import { FAMILIES } from '../../study/families';
import type { ParamSpec } from '../../study/families/types';
import { PAIR_TEXT, useLang, useT } from '../i18n';
import { Essay } from '../study/Essay';

const UNITS: Partial<Record<ParamSpec['type'], string>> = { length: ' px', angle: '°' };

function Range({ spec }: { spec: ParamSpec }) {
  const t = useT();
  if (spec.type === 'token') return <>{t('paramToken')}</>;
  if (spec.type === 'enum') return <code>{spec.values.join(' | ')}</code>;
  return (
    <code>
      {spec.min}–{spec.max}
      {UNITS[spec.type] ?? ''}
    </code>
  );
}

/** How a theme is made: the method essay, the detail families from their own metadata, and the contrast contract. */
export function Method() {
  const lang = useLang();
  const t = useT();
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">{t('titleMethod')}</h1>
        <p className="site-lead">{t('methodLead')}</p>
      </header>

      <Essay slug="method" />

      <section className="study-section" aria-labelledby="method-families">
        <h2 className="site-h2" id="method-families">
          {t('familiesHeading')}
        </h2>
        {Object.values(FAMILIES).map((family) => (
          <article key={family.name} className="study-family" aria-labelledby={`family-${family.name}`}>
            <h3 className="site-h3" id={`family-${family.name}`}>
              <code>{family.name}</code>
            </h3>
            <p className="site-p">{family.description[lang]}</p>
            <p className="site-p study-family__touches">
              {t('touchesLabel')}:{' '}
              {family.touches.map((root, i) => (
                <span key={root}>
                  {i ? ', ' : ''}
                  <code>.{root}</code>
                </span>
              ))}
            </p>
            <div className="site-props">
              <table aria-labelledby={`family-${family.name}`}>
                <thead>
                  <tr>
                    <th scope="col">{t('paramName')}</th>
                    <th scope="col">{t('paramDefault')}</th>
                    <th scope="col">{t('paramRange')}</th>
                    <th scope="col">{t('paramMeaning')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(family.params).map(([name, spec]) => (
                    <tr key={name}>
                      <th scope="row">
                        <code>{name}</code>
                      </th>
                      <td>
                        <code>{String(spec.default)}</code>
                      </td>
                      <td>
                        <Range spec={spec} />
                      </td>
                      <td>{spec.description[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>

      <section className="study-section" aria-labelledby="method-contract">
        <h2 className="site-h2" id="method-contract">
          {t('contractHeading')}
        </h2>
        <p className="site-p">{t('contractLead')}</p>
        <div className="site-props">
          <table aria-labelledby="method-contract">
            <thead>
              <tr>
                <th scope="col">{t('colPair')}</th>
                <th scope="col">{t('colToken')}</th>
                <th scope="col">{t('colNeeds')}</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST_PAIRS.map((pair) => (
                <tr key={`${pair.fg} ${pair.bg}`}>
                  <th scope="row">{PAIR_TEXT[`${pair.fg} ${pair.bg}`][lang]}</th>
                  <td>
                    <code>{pair.fg}</code> / <code>{pair.bg}</code>
                  </td>
                  <td>{pair.min}:1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
