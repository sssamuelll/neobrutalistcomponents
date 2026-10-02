import { Select } from 'neobrutalistcomponents';

export default function Grouped() {
  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        label="Plan and billing cycle"
        defaultValue="team-yearly"
        description="Switch any time; we prorate the difference."
      >
        <optgroup label="Billed monthly">
          <option value="starter-monthly">Starter — $12 / month</option>
          <option value="team-monthly">Team — $39 / month</option>
          <option value="scale-monthly">Scale — $120 / month</option>
        </optgroup>
        <optgroup label="Billed yearly (2 months free)">
          <option value="starter-yearly">Starter — $120 / year</option>
          <option value="team-yearly">Team — $390 / year</option>
          <option value="scale-yearly">Scale — $1,200 / year</option>
        </optgroup>
      </Select>
    </div>
  );
}
