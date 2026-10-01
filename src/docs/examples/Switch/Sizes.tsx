import { Switch } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 380 }}>
      <Switch
        size="md"
        label="Auto-renew my subscription"
        description="Renews on the 1st of each month. Cancel anytime."
        defaultChecked
      />
      <Switch
        size="sm"
        label="Include tax in invoices"
        description="Shown as a separate line on every receipt."
        defaultChecked
      />
    </div>
  );
}
