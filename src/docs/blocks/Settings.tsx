import { useState } from 'react';
import { Alert, Button, Card, Dialog, Input, Select, Switch, Tabs, Textarea } from 'neobrutalistcomponents';

export default function Settings() {
  const [tab, setTab] = useState('general');
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState('');
  const [deleted, setDeleted] = useState(false);

  return (
    <Card as="section" aria-labelledby="settings-title">
      <Card.Header>
        <Card.Title as="h2" id="settings-title">
          Workspace settings
        </Card.Title>
        <Card.Description>Northwind. Changes save when you press Save.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List aria-label="Settings sections">
            <Tabs.Tab value="general">General</Tabs.Tab>
            <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
            <Tabs.Tab value="danger">Danger zone</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="general">
            <div style={{ display: 'grid', gap: 'var(--nbc-space-lg)', maxInlineSize: 520 }}>
              <Input label="Workspace name" defaultValue="Northwind" />
              <Select label="Time zone" defaultValue="Europe/Berlin" description="Used for deploy windows and reports.">
                <option value="America/New_York">New York (UTC−4)</option>
                <option value="Europe/Berlin">Berlin (UTC+2)</option>
                <option value="Asia/Singapore">Singapore (UTC+8)</option>
              </Select>
              <Textarea label="Description" rows={3} defaultValue="Storefront, API and the internal admin." />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="notifications">
            <div style={{ display: 'grid', gap: 'var(--nbc-space-lg)' }}>
              <Switch label="Failed deploys" description="Email the person who pushed the commit." defaultChecked />
              <Switch label="Weekly usage report" description="Every Monday at 09:00 in your time zone." defaultChecked />
              <Switch label="Product updates" description="At most one email a month." />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="danger">
            {deleted ? (
              <Alert variant="success" title="Workspace scheduled for deletion">
                Northwind will be deleted in 7 days. Restore it any time before then from the billing page.
              </Alert>
            ) : (
              <Alert
                variant="danger"
                title="Delete this workspace"
                action={
                  <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                    Delete workspace
                  </Button>
                }
              >
                Removes every project, deploy and domain. Members lose access immediately.
              </Alert>
            )}
          </Tabs.Panel>
        </Tabs>
      </Card.Content>
      <Card.Footer>
        <Button variant="ghost">Discard changes</Button>
        <Button>Save</Button>
      </Card.Footer>

      <Dialog
        open={confirming}
        onOpenChange={(open) => {
          setConfirming(open);
          if (!open) setTyped('');
        }}
        size="sm"
      >
        <Dialog.Header>
          <Dialog.Title>Delete Northwind?</Dialog.Title>
          <Dialog.Description>Type the workspace name to confirm. You can restore it for 7 days.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Content>
          <Input label="Workspace name" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Northwind" />
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Keep workspace
          </Button>
          <Button
            variant="danger"
            disabled={typed !== 'Northwind'}
            onClick={() => {
              setDeleted(true);
              setConfirming(false);
            }}
          >
            Delete workspace
          </Button>
        </Dialog.Footer>
      </Dialog>
    </Card>
  );
}
