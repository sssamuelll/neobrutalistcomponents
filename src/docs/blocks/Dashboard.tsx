import { Alert, Badge, Button, Card, Kbd, Progress, Select, Table } from 'neobrutalistcomponents';
import { Plus } from 'lucide-react';

const STATS = [
  { label: 'Requests', value: '1.24M', delta: '+8.1%', tone: 'success' as const },
  { label: 'Error rate', value: '0.12%', delta: '−0.03 pts', tone: 'success' as const },
  { label: 'p95 latency', value: '182 ms', delta: '+14 ms', tone: 'warning' as const },
  { label: 'Deploys', value: '14', delta: '3 today', tone: 'neutral' as const },
];

const DEPLOYS = [
  { id: 'dpl_8f2a', commit: 'Fix currency rounding on invoices', author: 'Ada', when: '09:42', took: '41 s', status: 'Live' },
  { id: 'dpl_7c1e', commit: 'Add SAML metadata endpoint', author: 'Grace', when: '08:15', took: '58 s', status: 'Ready' },
  { id: 'dpl_6b90', commit: 'Bump image optimizer to 4.2', author: 'Linus', when: 'Yesterday', took: '1 m 12 s', status: 'Failed' },
  { id: 'dpl_5a77', commit: 'Cache pricing page for 60 s', author: 'Ada', when: 'Yesterday', took: '39 s', status: 'Ready' },
];

const STATUS_VARIANT = { Live: 'success', Ready: 'neutral', Failed: 'danger' } as const;

const headingStyle = {
  margin: 0,
  fontFamily: 'var(--nbc-font-display)',
  fontWeight: 'var(--nbc-weight-display)',
  fontStretch: 'var(--nbc-display-stretch)',
  letterSpacing: 'var(--nbc-display-spacing)',
  textTransform: 'var(--nbc-display-transform)' as 'none',
  lineHeight: 1.05,
};

export default function Dashboard() {
  return (
    <section aria-labelledby="dash-title" style={{ display: 'grid', gap: 'var(--nbc-space-xl)' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 'var(--nbc-space-lg)' }}>
        <div>
          <h2 id="dash-title" style={{ ...headingStyle, fontSize: 'var(--nbc-fs-3xl)' }}>
            northwind-web
          </h2>
          <p style={{ margin: 'var(--nbc-space-xs) 0 0', color: 'var(--nbc-fg-muted)' }}>
            Production. Press <Kbd size="sm">D</Kbd> to deploy the latest commit.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'end', gap: 'var(--nbc-space-md)' }}>
          <Select label="Range" size="sm" defaultValue="7d" style={{ minInlineSize: 150 }}>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
          <Button size="sm" leftIcon={<Plus />}>
            New deploy
          </Button>
        </div>
      </header>

      <Alert variant="warning" title="The certificate for api.northwind.dev expires in 6 days">
        Renewal failed because the DNS record changed. Point the CNAME back to edge.northwind.dev and retry.
      </Alert>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--nbc-space-lg)',
        }}
      >
        {STATS.map((s) => (
          <Card key={s.label} as="li">
            <Card.Content style={{ display: 'grid', gap: 'var(--nbc-space-xs)' }}>
              <span style={{ fontSize: 'var(--nbc-fs-sm)', color: 'var(--nbc-fg-muted)' }}>{s.label}</span>
              <span style={{ ...headingStyle, fontSize: 'var(--nbc-fs-2xl)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
              <span>
                <Badge size="sm" variant={s.tone}>
                  {s.delta}
                </Badge>
              </span>
            </Card.Content>
          </Card>
        ))}
      </ul>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'var(--nbc-space-xl)', alignItems: 'start' }}>
        <Card>
          <Card.Header>
            <Card.Title as="h3">Plan usage</Card.Title>
            <Card.Description>Pro plan. Resets on the 1st.</Card.Description>
          </Card.Header>
          <Card.Content style={{ display: 'grid', gap: 'var(--nbc-space-lg)' }}>
            <Progress label="Bandwidth: 412 of 1,000 GB" value={41} showValue />
            <Progress label="Build minutes: 5,300 of 6,000" value={88} showValue variant="warning" />
            <Progress label="Image optimizations: 5,000 of 5,000" value={100} showValue variant="danger" />
          </Card.Content>
          <Card.Footer>
            <Button variant="secondary" size="sm">
              Compare plans
            </Button>
          </Card.Footer>
        </Card>

        <div style={{ display: 'grid', gap: 'var(--nbc-space-sm)', minInlineSize: 0 }}>
          <h3 style={{ ...headingStyle, fontSize: 'var(--nbc-fs-xl)' }}>Recent deploys</h3>
          <Table density="compact">
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Commit</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell align="end">Took</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {DEPLOYS.map((d) => (
                <Table.Row key={d.id}>
                  <Table.Cell>
                    {d.commit}
                    <br />
                    <span style={{ color: 'var(--nbc-fg-muted)', fontSize: 'var(--nbc-fs-xs)' }}>{d.when}</span>
                  </Table.Cell>
                  <Table.Cell>{d.author}</Table.Cell>
                  <Table.Cell numeric>{d.took}</Table.Cell>
                  <Table.Cell>
                    <Badge size="sm" variant={STATUS_VARIANT[d.status as keyof typeof STATUS_VARIANT]}>
                      {d.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </section>
  );
}
