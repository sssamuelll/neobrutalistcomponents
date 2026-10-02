import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';

export function ComponentsIndex() {
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">Components</h1>
        <p className="site-lead">
          {COMPONENTS.length} components, each a thin layer over a native element. They share one size scale, one
          field API and one token contract, so they line up in every theme.
        </p>
      </header>
      {GROUP_ORDER.map((group) => {
        const items = COMPONENTS.filter((c) => c.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="site-index__group" aria-labelledby={`group-${group}`}>
            <h2 className="site-h2" id={`group-${group}`}>
              {group}
            </h2>
            <ul className="site-index">
              {items.map((c) => (
                <li key={c.slug}>
                  <a href={`#/components/${c.slug}`} className="site-index__item">
                    <span className="site-index__name">{c.name}</span>
                    <span className="site-index__summary">{c.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
