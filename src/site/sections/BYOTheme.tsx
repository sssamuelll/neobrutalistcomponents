import { CodeBlock } from './CodeBlock';

export function BYOTheme() {
  return (
    <section className="site-section">
      <h2>Bring your own theme</h2>
      <p>
        Define the token contract in your own CSS. Components read{' '}
        <code>var(--nbc-*)</code> and do not care where the values come from.
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
    </section>
  );
}
