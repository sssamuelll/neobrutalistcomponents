import { CodeBlock } from './CodeBlock';

export function GetStarted() {
  return (
    <section className="gs">
      <div className="gs__grid">
        <div className="gs__col">
          <h2 className="gs__h2">Install</h2>
          <CodeBlock>npm install neobrutalistcomponents</CodeBlock>

          <h2 className="gs__h2">Use</h2>
          <CodeBlock>{`import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';

export function App() {
  return (
    <NeoProvider theme="classic">
      <Button>Hello</Button>
    </NeoProvider>
  );
}`}</CodeBlock>

          <h2 className="gs__h2">Fonts</h2>
          <p className="gs__p">
            The library loads no fonts. Each theme expects specific families
            (see <a href="https://github.com/sssamuelll/neobrutalistcomponents#fonts" target="_blank" rel="noreferrer">README#fonts</a>).
            The Google Fonts one-liner:
          </p>
          <CodeBlock>{`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&family=VT323&family=Sixtyfour&family=Bungee+Shade&display=swap" />`}</CodeBlock>
        </div>

        <div className="gs__col">
          <h2 className="gs__h2">Bring your own theme</h2>
          <p className="gs__p">
            Define the token contract in your own CSS. Components read{' '}
            <code>var(--nbc-*)</code> and don't care where the values come from.
          </p>
          <CodeBlock>{`/* my-theme.css */
[data-theme="minimal"] {
  --nbc-font-sans: 'IBM Plex Sans', sans-serif;
  --nbc-fg: #111;
  --nbc-bg: #fff;
  --nbc-primary: #000;
  --nbc-primary-fg: #fff;
  --nbc-danger: #d00;
  --nbc-danger-fg: #fff;
  --nbc-border-color: #111;
  --nbc-border-width: 1px;
  --nbc-border-style: solid;
  --nbc-radius: 2px;
  --nbc-shadow: none;
  --nbc-shadow-lg: none;
  --nbc-rotate: 0deg;
  --nbc-focus: #000;
  --nbc-weight-label: 600;
  --nbc-label-transform: none;
  --nbc-label-spacing: normal;
}`}</CodeBlock>

          <h2 className="gs__h2">Links</h2>
          <ul className="gs__list">
            <li><a href="https://www.npmjs.com/package/neobrutalistcomponents" target="_blank" rel="noreferrer">npm package</a></li>
            <li><a href="https://github.com/sssamuelll/neobrutalistcomponents" target="_blank" rel="noreferrer">Source on GitHub</a></li>
            <li><a href="https://github.com/sssamuelll/neobrutalistcomponents/issues" target="_blank" rel="noreferrer">Issue tracker</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
