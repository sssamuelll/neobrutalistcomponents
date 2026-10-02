import { Checkbox } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 380 }}>
      <Checkbox
        size="md"
        label="Auto-renew my subscription"
        description="Renews on the 1st of each month. Cancel anytime."
        defaultChecked
      />
      <Checkbox
        size="sm"
        label="Include tax in invoices"
        description="Shown as a separate line on every receipt."
        defaultChecked
      />
    </div>
  );
}
