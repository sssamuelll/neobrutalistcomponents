import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { CodeBlock } from '../docs/CodeBlock';
import { BYO_THEME_CODE, FONTS_NOTE, INSTALL_CODE, REPO_URL, SETUP_CODE } from '../../docs/guide';

const MODE_CODE = `<NeoProvider theme="tech">              {/* tech is dark by nature */}
<NeoProvider theme="tech" mode="light">  {/* green-bar paper */}
<NeoProvider theme="classic" mode="system"> {/* follows the OS */}`;

const OVERRIDE_CODE = `/* Your stylesheet — no !important, no specificity games:
   the library lives in cascade layers, unlayered CSS wins. */
.checkout .nbc-button--primary {
  min-inline-size: 12rem;
}

/* Retune a token for one region. */
.compact-sidebar {
  --nbc-space-lg: 12px;
  --nbc-radius-control: 4px;
}`;

const RSC_CODE = `// app/layout.tsx (Next.js App Router) — no wrapper needed:
// the bundle is marked 'use client'.
import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/swiss.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NeoProvider theme="swiss" mode="system">{children}</NeoProvider>
      </body>
    </html>
  );
}`;

export function Start() {
  return (
    <div className="site-page site-prose">
      <header className="site-page__head">
        <h1 className="site-h1">Get started</h1>
        <p className="site-lead">Three imports and a provider. Everything else is a prop or a token.</p>
      </header>

      <section aria-labelledby="install">
        <h2 className="site-h2" id="install">
          Install
        </h2>
        <p className="site-p">React 19 is the only peer dependency. The package ships ESM, type declarations and plain CSS.</p>
        <CodeBlock code={INSTALL_CODE} label="Shell" />
      </section>

      <section aria-labelledby="setup">
        <h2 className="site-h2" id="setup">
          Set up
        </h2>
        <p className="site-p">
          Import the core stylesheet once, then one theme. <code>NeoProvider</code> scopes the theme to its subtree and
          paints the background, text color and font.
        </p>
        <CodeBlock code={SETUP_CODE} label="TSX" />
      </section>

      <section aria-labelledby="modes">
        <h2 className="site-h2" id="modes">
          Light and dark
        </h2>
        <p className="site-p">
          Every theme has a native scheme and a full counterpart. Leave <code>mode</code> unset to get the native one,
          force it with <code>light</code> or <code>dark</code>, or follow the operating system with <code>system</code>.
          Providers nest: an inner provider is a self-contained island with its own theme and scheme.
        </p>
        <CodeBlock code={MODE_CODE} label="TSX" />
      </section>

      <section aria-labelledby="fonts">
        <h2 className="site-h2" id="fonts">
          Fonts
        </h2>
        <p className="site-p">{FONTS_NOTE}</p>
        <div className="site-props">
          <table>
            <caption>Font families per theme</caption>
            <thead>
              <tr>
                <th scope="col">Theme</th>
                <th scope="col">Families</th>
                <th scope="col">Optional loader</th>
              </tr>
            </thead>
            <tbody>
              {NEO_THEMES.map((id) => (
                <tr key={id}>
                  <th scope="row">{THEME_INFO[id].name}</th>
                  <td>{THEME_INFO[id].fonts.join(', ')}</td>
                  <td>
                    <code>neobrutalistcomponents/themes/{id}.fonts.css</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="customize">
        <h2 className="site-h2" id="customize">
          Customize
        </h2>
        <p className="site-p">
          Override with ordinary CSS. Every component exposes stable <code>nbc-*</code> class hooks, and every visual
          decision is a <code>--nbc-*</code> token you can retune for any subtree.
        </p>
        <CodeBlock code={OVERRIDE_CODE} label="CSS" />
      </section>

      <section aria-labelledby="byo">
        <h2 className="site-h2" id="byo">
          Bring your own theme
        </h2>
        <p className="site-p">
          A theme is one block of tokens under <code>[data-theme="name"]</code>. Put it in the <code>nbc.theme</code>{' '}
          layer so reduced-motion and mode rules still apply on top, then pass the name to <code>NeoProvider</code>.
        </p>
        <CodeBlock code={BYO_THEME_CODE} label="CSS" />
      </section>

      <section aria-labelledby="rsc">
        <h2 className="site-h2" id="rsc">
          Server components
        </h2>
        <CodeBlock code={RSC_CODE} label="TSX" />
      </section>

      <section aria-labelledby="migrate">
        <h2 className="site-h2" id="migrate">
          Coming from 0.2
        </h2>
        <ul className="site-list">
          <li>
            Import <code>styles.css</code> (the old <code>neobrutalistcomponents.css</code> path still works) and a theme.
          </li>
          <li>
            Input: <code>variant="error"</code> + <code>errorMessage</code> → <code>error="…"</code>;{' '}
            <code>helperText</code> → <code>description</code>.
          </li>
          <li>
            Button defaults to <code>type="button"</code>; pass <code>type="submit"</code> in forms.
          </li>
          <li>
            <code>useTheme()</code> returns <code>{'{ theme, mode }'}</code> instead of a string.
          </li>
          <li>The package is ESM-only.</li>
        </ul>
        <p className="site-p">
          Full list in{' '}
          <a href={`${REPO_URL}/blob/main/MIGRATION.md`} target="_blank" rel="noreferrer">
            MIGRATION.md
          </a>
          .
        </p>
      </section>
    </div>
  );
}
