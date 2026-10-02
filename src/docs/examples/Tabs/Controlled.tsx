import { useState } from 'react';
import { Badge, Button, Tabs } from 'neobrutalistcomponents';

export default function Controlled() {
  const [tab, setTab] = useState('invites');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" variant="secondary" onClick={() => setTab('members')}>
          Show members
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setTab('invites')}>
          Show pending invites
        </Button>
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <Tabs.List aria-label="Team">
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="invites">
            Invites <Badge>2</Badge>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="members">8 people have access to this workspace.</Tabs.Panel>
        <Tabs.Panel value="invites">maria@acme.dev and jonas@acme.dev have not accepted yet.</Tabs.Panel>
      </Tabs>
    </div>
  );
}
