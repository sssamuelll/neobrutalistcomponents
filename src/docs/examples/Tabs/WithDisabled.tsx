import { Tabs } from 'neobrutalistcomponents';

export default function WithDisabled() {
  return (
    <Tabs defaultValue="invoices">
      <Tabs.List aria-label="Billing">
        <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
        <Tabs.Tab value="usage">Usage</Tabs.Tab>
        <Tabs.Tab value="tax" disabled>
          Tax settings
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="invoices">Your last invoice of $49.00 was paid on September 28.</Tabs.Panel>
      <Tabs.Panel value="usage">412 of 1,000 build minutes used this cycle.</Tabs.Panel>
      <Tabs.Panel value="tax">Available on the Team plan.</Tabs.Panel>
    </Tabs>
  );
}
