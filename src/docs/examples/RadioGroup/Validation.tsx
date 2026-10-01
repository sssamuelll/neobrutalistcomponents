import { useState } from 'react';
import { Button, Radio, RadioGroup } from 'neobrutalistcomponents';

export default function Validation() {
  const [region, setRegion] = useState('');
  const [submitted, setSubmitted] = useState(true);
  const missing = submitted && region === '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}
    >
      <RadioGroup
        label="Deploy region"
        name="region"
        required
        value={region}
        onValueChange={setRegion}
        description="Pick the region closest to your users."
        error={missing ? 'Choose a region before you deploy.' : undefined}
      >
        <Radio value="fra1" label="Frankfurt" description="fra1 · lowest latency for Europe" />
        <Radio value="iad1" label="Washington, D.C." description="iad1 · lowest latency for the US east coast" />
        <Radio value="sin1" label="Singapore" description="sin1 · lowest latency for Southeast Asia" />
      </RadioGroup>
      <div>
        <Button type="submit">Deploy to production</Button>
      </div>
    </form>
  );
}
