import { Checkbox } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox label="Email me when a deploy fails" defaultChecked />
      <Checkbox label="Send a weekly usage summary" />
      <Checkbox label="Notify me about new invoices" disabled />
    </div>
  );
}
