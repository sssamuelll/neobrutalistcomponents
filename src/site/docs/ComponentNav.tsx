import { COMPONENTS } from '../../docs/meta';
import { GROUP_ORDER } from '../../docs/types';
import { useLang } from '../i18n';
import { toHash } from '../router';

export function ComponentNav({ current }: { current?: string }) {
  const lang = useLang();
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
                  <a href={toHash(lang, `/components/${c.slug}`)} aria-current={current === c.slug ? 'page' : undefined}>
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
