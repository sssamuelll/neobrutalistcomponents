import { useState } from 'react';
import { Radio, RadioGroup } from 'neobrutalistcomponents';

export default function Basic() {
  const [plan, setPlan] = useState('pro');

  return (
    <div style={{ maxWidth: 420 }}>
      <RadioGroup
        label="Plan"
        description="You can switch plans at any time from billing settings."
        value={plan}
        onValueChange={setPlan}
      >
        <Radio value="hobby" label="Hobby" description="One project, community support. Free." />
        <Radio value="pro" label="Pro" description="Unlimited projects and previews. $19 per month." />
        <Radio value="team" label="Team" description="Shared billing and roles for up to 20 seats. $49 per month." />
      </RadioGroup>
    </div>
  );
}
