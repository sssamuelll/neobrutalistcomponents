import { COMPONENTS, findComponent } from '../../docs/meta';
import { ComponentNav } from '../docs/ComponentNav';
import { Example } from '../docs/Example';
import { PropsTable } from '../docs/PropsTable';
import { getExample } from '../docs/registry';
import { NotFound } from './NotFound';
import { useLang } from '../i18n';
import { toHash } from '../router';

export function ComponentPage({ slug }: { slug: string }) {
  const lang = useLang();
  const meta = findComponent(slug);
  if (!meta) return <NotFound />;
  const index = COMPONENTS.indexOf(meta);
  const prev = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];

  return (
    <div className="site-docs">
      <ComponentNav current={slug} />
      <article className="site-doc">
        <header className="site-doc__head">
          <p className="site-doc__crumbs">
            <a href={toHash(lang, '/components')}>Components</a> <span aria-hidden="true">/</span> {meta.group}
          </p>
          <h1 className="site-h1">{meta.name}</h1>
          <p className="site-lead">{meta.summary}</p>
        </header>

        <div className="site-when">
          <section>
            <h2 className="site-h3">Use it for</h2>
            <ul>
              {meta.whenToUse.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="site-h3">Reach for something else</h2>
            <ul>
              {meta.whenNotToUse.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        </div>

        <h2 className="site-h2">Examples</h2>
        {meta.examples.map((ex) => {
          const source = getExample(meta.name, ex.file);
          return source ? (
            <Example
              key={ex.file}
              id={`${meta.slug}-${ex.file.toLowerCase()}`}
              title={ex.title}
              description={ex.description}
              source={source}
            />
          ) : null;
        })}

        <h2 className="site-h2">Props</h2>
        <p className="site-p">
          Extends <code>{meta.extends}</code>: every native prop is forwarded to the underlying element.
        </p>
        <PropsTable props={meta.props} caption={`${meta.name} props`} />

        {meta.subcomponents && meta.subcomponents.length > 0 && (
          <>
            <h2 className="site-h2">Parts</h2>
            <dl className="site-parts">
              {meta.subcomponents.map((s) => (
                <div key={s.name} className="site-parts__item">
                  <dt>
                    <code>{s.name}</code> <span className="site-parts__el">&lt;{s.element}&gt;</span>
                  </dt>
                  <dd>
                    {s.description}
                    {s.props && <PropsTable props={s.props} caption={`${s.name} props`} />}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <div className="site-guides">
          <section>
            <h2 className="site-h2">Accessibility</h2>
            <ul className="site-list">
              {meta.accessibility.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="site-h2">Rules</h2>
            <ul className="site-list">
              {meta.rules.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        </div>

        <h2 className="site-h2">CSS hooks</h2>
        <p className="site-p">
          Stable class names for targeted overrides. The library lives in cascade layers, so a plain rule in your own
          stylesheet wins without <code>!important</code>.
        </p>
        <ul className="site-hooks">
          {meta.classes.map((c) => (
            <li key={c}>
              <code>.{c}</code>
            </li>
          ))}
        </ul>

        <nav className="site-pager" aria-label="Previous and next component">
          {prev ? (
            <a href={toHash(lang, `/components/${prev.slug}`)} rel="prev">
              <span className="site-pager__dir">Previous</span> {prev.name}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a href={toHash(lang, `/components/${next.slug}`)} rel="next">
              <span className="site-pager__dir">Next</span> {next.name}
            </a>
          )}
        </nav>
      </article>
    </div>
  );
}
