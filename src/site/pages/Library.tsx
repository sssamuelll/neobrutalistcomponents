import { Badge, Button, Card, Input, NeoProvider, Progress, Select, Switch, NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { ArrowRight, GitBranch } from 'lucide-react';
import { COMPONENTS } from '../../docs/meta';
import { INSTALL_CODE, pageUrl } from '../../docs/guide';
import { CodeBlock } from '../docs/CodeBlock';
import { useSitePrefsContext } from '../prefsContext';
import { useLang } from '../i18n';
import { toHash } from '../router';

const PLATFORM: { term: string; text: string }[] = [
  { term: '@layer', text: 'Your CSS always wins. The library lives in cascade layers, so a plain rule in your stylesheet beats it without !important.' },
  { term: 'light-dark()', text: 'Every color carries its light and dark value. One mode prop flips the scheme; each theme also has a native one.' },
  { term: '@scope', text: 'Themes nest. A riso island inside a classic page stays riso, down to the last flourish.' },
  { term: '<dialog> + showModal()', text: 'Focus trapping, Esc and an inert page behind the dialog come from the browser, not from JavaScript.' },
  { term: 'popover + anchor-name', text: 'Tooltips render in the top layer — never clipped by overflow — and position themselves against their trigger.' },
  { term: 'field-sizing: content', text: 'Textareas grow with what people type, starting from the rows you ask for.' },
  { term: 'appearance: base-select', text: 'Where the browser supports it, the open Select list is themed too. Everywhere else it stays native.' },
];

function Specimen() {
  return (
    <Card variant="elevated" as="section" aria-labelledby="specimen-title" className="home-specimen">
      <Card.Header>
        <div className="home-specimen__title">
          <Card.Title as="h2" id="specimen-title">
            Deploy northwind-web
          </Card.Title>
          <Badge variant="info">Preview</Badge>
        </div>
        <Card.Description>Build 2,481 is ready. Choose where it goes.</Card.Description>
      </Card.Header>
      <Card.Content className="home-specimen__body">
        <Progress label="Build" value={100} showValue variant="success" size="sm" />
        <div className="home-specimen__row">
          <Input label="Branch" defaultValue="main" leftIcon={<GitBranch />} />
          <Select label="Region" defaultValue="fra">
            <option value="fra">Frankfurt</option>
            <option value="iad">Washington</option>
            <option value="sin">Singapore</option>
          </Select>
        </div>
        <Switch label="Promote to production when checks pass" defaultChecked />
      </Card.Content>
      <Card.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button rightIcon={<ArrowRight />}>Deploy</Button>
      </Card.Footer>
    </Card>
  );
}

function ThemeStrip() {
  const { prefs, update } = useSitePrefsContext();
  return (
    <ul className="home-themes" aria-label="Themes">
      {NEO_THEMES.map((id) => (
        <li key={id}>
          <NeoProvider theme={id} mode={prefs.mode === 'native' ? undefined : prefs.mode} className="home-theme">
            <button type="button" className="home-theme__hit" aria-pressed={prefs.theme === id} onClick={() => update({ theme: id })}>
              <span className="home-theme__name">{THEME_INFO[id].name}</span>
              <span className="home-theme__tagline">{THEME_INFO[id].tagline}</span>
              <span className="nbc-button nbc-button--primary nbc-button--sm home-theme__sample" aria-hidden="true">
                <span className="nbc-button__label">{prefs.theme === id ? 'In use' : 'Use it'}</span>
              </span>
            </button>
          </NeoProvider>
        </li>
      ))}
    </ul>
  );
}

function SameShape() {
  const { prefs } = useSitePrefsContext();
  return (
    <div className="home-shape" role="group" aria-label="The same row of controls in every theme">
      {NEO_THEMES.map((id) => (
        <NeoProvider key={id} theme={id} mode={prefs.mode === 'native' ? undefined : prefs.mode} className="home-shape__row">
          <span className="home-shape__name">{THEME_INFO[id].name}</span>
          <Input aria-label={`Email (${THEME_INFO[id].name})`} placeholder="ada@northwind.dev" />
          <Select aria-label={`Role (${THEME_INFO[id].name})`} defaultValue="editor">
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </Select>
          <Button>Invite</Button>
        </NeoProvider>
      ))}
    </div>
  );
}

/** The library's own landing page (it was the site's home before the study). */
export function Library() {
  const lang = useLang();
  const llms = [
    '# neobrutalistcomponents',
    '',
    '> Brutalist React components. Five themes, light and dark, one token contract.',
    '',
    '## Forms',
    ...COMPONENTS.filter((c) => c.group === 'Forms')
      .slice(0, 2)
      .map((c) => `- [${c.name}](${pageUrl(`/components/${c.slug}`)}): ${c.summary}`),
  ].join('\n');

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <h1 className="home-title" id="home-title">
            Components that hold their shape.
          </h1>
          <p className="site-lead">
            Sixteen React components on one token contract. Five themes, light and dark, and the same geometry in every
            one — documented for the people and the agents who build with them.
          </p>
          <CodeBlock code={INSTALL_CODE} label="Shell" />
          <div className="home-hero__ctas">
            <Button asChild size="lg" rightIcon={<ArrowRight />}>
              <a href={toHash(lang, '/start')}>Set it up</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={toHash(lang, '/components')}>Browse components</a>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <a href={toHash(lang, '/blocks')}>See full screens</a>
            </Button>
          </div>
        </div>
        <Specimen />
      </section>

      <section className="home-section" aria-labelledby="home-themes-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-themes-title">
            Five themes. Pick one and stop deciding.
          </h2>
          <p className="site-p">
            Each theme is a complete point of view — type, color, edges, shadows, motion — in a light and a dark scheme.
            Click one: this whole site switches.
          </p>
        </div>
        <ThemeStrip />
      </section>

      <section className="home-section" aria-labelledby="home-shape-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-shape-title">
            Same shape in every theme
          </h2>
          <p className="site-p">
            Controls share one height scale — 32, 40 and 48 pixels — in all five themes. Swapping themes never moves
            your layout; only the voice changes.
          </p>
        </div>
        <SameShape />
      </section>

      <section className="home-section home-split" aria-labelledby="home-platform-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-platform-title">
            Built on the platform
          </h2>
          <p className="site-p">
            No runtime dependencies. The hard parts are done by the browser, the way 2026 browsers can do them.
          </p>
        </div>
        <dl className="home-platform">
          {PLATFORM.map((p) => (
            <div key={p.term}>
              <dt>
                <code>{p.term}</code>
              </dt>
              <dd>{p.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-section home-split" aria-labelledby="home-agents-title">
        <div className="home-section__intro">
          <h2 className="site-h2" id="home-agents-title">
            Readable by agents
          </h2>
          <p className="site-p">
            Every component, prop, rule and example is published as llms.txt and as a Claude Code skill, generated from
            the same metadata as these pages. Ask an agent for a settings screen and it reaches for the same pieces you
            would.
          </p>
          <Button asChild variant="secondary">
            <a href={toHash(lang, '/agents')}>How agents use it</a>
          </Button>
        </div>
        <CodeBlock code={llms} label="llms.txt" />
      </section>
    </div>
  );
}
