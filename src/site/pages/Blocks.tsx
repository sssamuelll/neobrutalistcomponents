import { Example } from '../docs/Example';
import { getBlock } from '../docs/registry';

const BLOCKS: { file: string; title: string; description: string }[] = [
  { file: 'SignIn', title: 'Sign in', description: 'Email and password with inline validation and a single primary action.' },
  { file: 'Pricing', title: 'Pricing', description: 'Three plans, one elevated, a billing-cycle switch.' },
  { file: 'Settings', title: 'Settings', description: 'Tabs, switches, a select and a destructive action behind a confirmation.' },
  { file: 'Dashboard', title: 'Dashboard', description: 'Usage, deploys and alerts — a dense screen on the same scale.' },
];

export function Blocks() {
  return (
    <div className="site-page">
      <header className="site-page__head">
        <h1 className="site-h1">Blocks</h1>
        <p className="site-lead">
          Whole screens composed only from the library and the spacing tokens. Copy one, keep the structure, change the
          words.
        </p>
      </header>
      {BLOCKS.map((b) => {
        const source = getBlock(b.file);
        return source ? (
          <Example key={b.file} id={`block-${b.file.toLowerCase()}`} title={b.title} description={b.description} source={source} bleed />
        ) : null;
      })}
    </div>
  );
}
