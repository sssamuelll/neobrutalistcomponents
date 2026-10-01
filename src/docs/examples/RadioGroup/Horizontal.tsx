import { Radio, RadioGroup } from 'neobrutalistcomponents';

export default function Horizontal() {
  return (
    <RadioGroup label="Billing cycle" orientation="horizontal" defaultValue="yearly" description="Yearly saves two months.">
      <Radio value="monthly" label="Monthly" />
      <Radio value="yearly" label="Yearly" />
    </RadioGroup>
  );
}
