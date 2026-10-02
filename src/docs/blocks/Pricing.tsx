import { useState } from 'react';
import { Badge, Button, Card, Switch } from 'neobrutalistcomponents';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Hobby',
    blurb: 'For side projects and trying things out.',
    monthly: 0,
    features: ['3 projects', 'Preview deploys', 'Community support'],
    cta: 'Start for free',
  },
  {
    name: 'Pro',
    blurb: 'For one team shipping to production.',
    monthly: 24,
    features: ['Unlimited projects', 'Password-protected previews', '99.95% uptime SLA', 'Email support in 1 business day'],
    cta: 'Start a 14-day trial',
    featured: true,
  },
  {
    name: 'Scale',
    blurb: 'For several teams and stricter controls.',
    monthly: 79,
    features: ['Everything in Pro', 'SAML single sign-on', 'Audit log export', 'A named support engineer'],
    cta: 'Talk to sales',
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section aria-labelledby="pricing-title" style={{ display: 'grid', gap: 'var(--nbc-space-xl)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 'var(--nbc-space-lg)' }}>
        <div>
          <h2
            id="pricing-title"
            style={{
              margin: 0,
              fontFamily: 'var(--nbc-font-display)',
              fontWeight: 'var(--nbc-weight-display)',
              fontStretch: 'var(--nbc-display-stretch)',
              letterSpacing: 'var(--nbc-display-spacing)',
              textTransform: 'var(--nbc-display-transform)' as 'none',
              fontSize: 'var(--nbc-fs-3xl)',
              lineHeight: 1.05,
            }}
          >
            Pay for what ships
          </h2>
          <p style={{ margin: 'var(--nbc-space-sm) 0 0', color: 'var(--nbc-fg-muted)' }}>Every plan includes unlimited seats.</p>
        </div>
        <Switch label="Bill yearly" description="Two months free." checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--nbc-space-xl)',
          alignItems: 'stretch',
        }}
      >
        {PLANS.map((plan) => {
          const price = yearly ? Math.round((plan.monthly * 10) / 12) : plan.monthly;
          return (
            <Card key={plan.name} as="li" variant={plan.featured ? 'elevated' : 'default'}>
              <Card.Header>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--nbc-space-sm)' }}>
                  <Card.Title>{plan.name}</Card.Title>
                  {plan.featured && <Badge variant="primary">Most teams</Badge>}
                </div>
                <Card.Description>{plan.blurb}</Card.Description>
              </Card.Header>
              <Card.Content style={{ display: 'grid', gap: 'var(--nbc-space-lg)', alignContent: 'start' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: 'var(--nbc-space-xs)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--nbc-font-display)',
                      fontWeight: 'var(--nbc-weight-display)',
                      fontStretch: 'var(--nbc-display-stretch)',
                      fontSize: 'var(--nbc-fs-4xl)',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ${price}
                  </span>
                  <span style={{ color: 'var(--nbc-fg-muted)', fontSize: 'var(--nbc-fs-sm)' }}>per month{yearly && plan.monthly > 0 ? ', billed yearly' : ''}</span>
                </p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--nbc-space-sm)' }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 'var(--nbc-space-sm)', alignItems: 'start' }}>
                      <Check aria-hidden="true" size={18} strokeWidth={3} style={{ flex: 'none', marginBlockStart: 3 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Footer>
                <Button fullWidth variant={plan.featured ? 'primary' : 'secondary'}>
                  {plan.cta}
                </Button>
              </Card.Footer>
            </Card>
          );
        })}
      </ul>
    </section>
  );
}
