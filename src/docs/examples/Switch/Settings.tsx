import { useState } from 'react';
import { Card, Switch } from 'neobrutalistcomponents';

const SETTINGS = [
  {
    key: 'previews',
    label: 'Deploy previews',
    description: 'Every pull request gets its own URL, rebuilt on each push.',
  },
  {
    key: 'failures',
    label: 'Email me when a deploy fails',
    description: 'Sent to ada@studio.dev within a minute, with the build log attached.',
  },
  {
    key: 'invoices',
    label: 'Notify me about new invoices',
    description: 'Billing owners are always notified, even when this is off.',
  },
] as const;

type Key = (typeof SETTINGS)[number]['key'];

export default function Settings() {
  const [enabled, setEnabled] = useState<Record<Key, boolean>>({ previews: true, failures: true, invoices: false });

  return (
    <Card style={{ maxWidth: 460 }}>
      <Card.Header>
        <Card.Title>Project settings</Card.Title>
        <Card.Description>Changes apply as soon as you flip a switch.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div style={{ display: 'grid', gap: 20 }}>
          {SETTINGS.map(({ key, label, description }) => (
            <Switch
              key={key}
              label={label}
              description={description}
              checked={enabled[key]}
              onChange={(e) => setEnabled((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
