import type { ReactNode } from 'react';
import { Button, Card, Input, NeoProvider } from '../../lib';
import type { NeoTheme, ButtonVariant, ButtonSize, InputSize } from '../../lib';
import { Icon } from './Icon';

function Section({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div className="mx-section">
      <div className="mx-section__head">
        <span className="mx-section__title">{title}</span>
        {sub && <span className="mx-section__sub">{sub}</span>}
      </div>
      <div className="mx-section__body">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mx-row">
      <div className="mx-row__label">{label}</div>
      <div className="mx-row__cells">{children}</div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mx-cell">
      <div className="mx-cell__label">{label}</div>
      <div className="mx-cell__demo">{children}</div>
    </div>
  );
}

const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'danger', 'ghost'];
const BUTTON_SIZES: readonly ButtonSize[] = ['sm', 'md', 'lg'];
const INPUT_SIZES: readonly InputSize[] = ['sm', 'md', 'lg'];

export function MatrixCanvas({ themeId }: { themeId: NeoTheme }) {
  return (
    <NeoProvider theme={themeId} className="mx-canvas" data-theme-wrap={themeId}>
      <div className="mx-canvas__bg" />
      <div className="mx-canvas__head">
        <div className="mx-canvas__kicker">neobrutalistcomponents v0.2 · full matrix</div>
        <div className="mx-canvas__theme">{themeId.toUpperCase()}</div>
      </div>

      <Section title="Button · variants × sizes" sub="primary · secondary · danger · ghost × sm · md · lg">
        {BUTTON_VARIANTS.map((variant) => (
          <Row key={variant} label={variant}>
            {BUTTON_SIZES.map((size) => (
              <Cell key={size} label={size}>
                <Button variant={variant} size={size}>
                  Action
                </Button>
              </Cell>
            ))}
          </Row>
        ))}
      </Section>

      <Section title="Button · states" sub="default · hover · focus-visible · disabled">
        <Row label="primary">
          <Cell label="default"><Button variant="primary">Confirm</Button></Cell>
          <Cell label="hover"><Button variant="primary" className="is-hover">Confirm</Button></Cell>
          <Cell label="focus"><Button variant="primary" className="is-focus">Confirm</Button></Cell>
          <Cell label="disabled"><Button variant="primary" disabled>Confirm</Button></Cell>
        </Row>
        <Row label="danger">
          <Cell label="default"><Button variant="danger">Delete</Button></Cell>
          <Cell label="hover"><Button variant="danger" className="is-hover">Delete</Button></Cell>
          <Cell label="focus"><Button variant="danger" className="is-focus">Delete</Button></Cell>
          <Cell label="disabled"><Button variant="danger" disabled>Delete</Button></Cell>
        </Row>
      </Section>

      <Section title="Button · modifiers" sub="loading · leftIcon · rightIcon · icon-only · fullWidth">
        <Row label="modifiers">
          <Cell label="loading"><Button variant="primary" loading>Saving</Button></Cell>
          <Cell label="leftIcon"><Button variant="secondary" leftIcon={<Icon.Plus />}>Add row</Button></Cell>
          <Cell label="rightIcon"><Button variant="primary" rightIcon={<Icon.Arrow />}>Continue</Button></Cell>
          <Cell label="icon-only">
            <Button
              variant="secondary"
              className="nbc-button--icon-only"
              leftIcon={<Icon.Search />}
              aria-label="search"
            />
          </Cell>
        </Row>
        <Row label="fullWidth">
          <Cell label="md">
            <div style={{ width: 320 }}>
              <Button variant="primary" fullWidth rightIcon={<Icon.Arrow />}>
                Ship it
              </Button>
            </div>
          </Cell>
        </Row>
      </Section>

      <Section title="Input · sizes × states" sub="default · focus · error · with-icon">
        {INPUT_SIZES.map((size) => (
          <Row key={size} label={size}>
            <Cell label="default"><Input size={size} label="Project" placeholder="acme-relaunch" /></Cell>
            <Cell label="focus"><Input size={size} label="Project" placeholder="acme-relaunch" className="is-focus" defaultValue="acme" /></Cell>
            <Cell label="error"><Input size={size} variant="error" label="Project" defaultValue="acme bad" errorMessage="Name must be kebab-case." /></Cell>
            <Cell label="with icon"><Input size={size} label="Search" placeholder="Find a repo…" leftIcon={<Icon.Search />} /></Cell>
          </Row>
        ))}
        <Row label="types">
          <Cell label="email"><Input label="Email" type="email" placeholder="you@domain.com" leftIcon={<Icon.Mail />} /></Cell>
          <Cell label="password"><Input label="Password" type="password" defaultValue="••••••••" leftIcon={<Icon.Lock />} rightIcon={<Icon.Eye />} /></Cell>
          <Cell label="number"><Input label="Seats" type="number" defaultValue="12" leftIcon={<Icon.Hash />} helperText="Up to 50 per team." /></Cell>
          <Cell label="read-only"><Input label="Slug" readOnly defaultValue="acme-relaunch" helperText="Assigned automatically." /></Cell>
        </Row>
      </Section>

      <Section title="Card · variants × composition" sub="default · elevated · interactive">
        <Row label="default">
          <Cell label="title only">
            <div style={{ width: 230 }}>
              <Card><Card.Header><Card.Title>Just a title</Card.Title></Card.Header></Card>
            </div>
          </Cell>
          <Cell label="+ description">
            <div style={{ width: 230 }}>
              <Card>
                <Card.Header>
                  <Card.Title>With description</Card.Title>
                  <Card.Description>A terse subhead sets the tone.</Card.Description>
                </Card.Header>
              </Card>
            </div>
          </Cell>
          <Cell label="+ footer">
            <div style={{ width: 230 }}>
              <Card>
                <Card.Header><Card.Title>With footer</Card.Title></Card.Header>
                <Card.Content>Short body copy fills the content slot.</Card.Content>
                <Card.Footer>
                  <Button variant="ghost" size="sm">Skip</Button>
                  <Button variant="primary" size="sm">OK</Button>
                </Card.Footer>
              </Card>
            </div>
          </Cell>
        </Row>
        <Row label="elevated">
          <Cell label="title only">
            <div style={{ width: 230 }}>
              <Card variant="elevated"><Card.Header><Card.Title>Elevated</Card.Title></Card.Header></Card>
            </div>
          </Cell>
          <Cell label="+ description">
            <div style={{ width: 230 }}>
              <Card variant="elevated">
                <Card.Header>
                  <Card.Title>Elevated</Card.Title>
                  <Card.Description>Heavier shadow stack.</Card.Description>
                </Card.Header>
              </Card>
            </div>
          </Cell>
          <Cell label="+ footer">
            <div style={{ width: 230 }}>
              <Card variant="elevated">
                <Card.Header><Card.Title>Elevated</Card.Title></Card.Header>
                <Card.Content>Full composition with deep offset.</Card.Content>
                <Card.Footer><Button variant="primary" size="sm">Go</Button></Card.Footer>
              </Card>
            </div>
          </Cell>
        </Row>
        <Row label="interactive">
          <Cell label="hover affordance">
            <div style={{ width: 230 }}>
              <Card variant="interactive">
                <Card.Header>
                  <Card.Title>Hover me</Card.Title>
                  <Card.Description>Press-down on hover.</Card.Description>
                </Card.Header>
                <Card.Content>Whole card is clickable.</Card.Content>
              </Card>
            </div>
          </Cell>
        </Row>
      </Section>
    </NeoProvider>
  );
}
