import { Radio, RadioGroup } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      <RadioGroup label="Email digest" size="sm" defaultValue="weekly">
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
        <Radio value="never" label="Never" />
      </RadioGroup>
      <RadioGroup label="Email digest" size="md" defaultValue="weekly">
        <Radio value="daily" label="Daily" />
        <Radio value="weekly" label="Weekly" />
        <Radio value="never" label="Never" />
      </RadioGroup>
    </div>
  );
}
