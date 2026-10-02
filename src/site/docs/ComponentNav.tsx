import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';

export function ComponentNav({ current }: { current?: string }) {
  return (
    <nav className="site-sidenav" aria-label="Components">
      {GROUP_ORDER.map((group) => {
        const items = COMPONENTS.filter((c) => c.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="site-sidenav__group">
            <p className="site-sidenav__heading">{group}</p>
            <ul>
              {items.map((c) => (
                <li key={c.slug}>
                  <a href={`#/components/${c.slug}`} aria-current={current === c.slug ? 'page' : undefined}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
