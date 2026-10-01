import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Checkbox } from 'neobrutalistcomponents';

export default function WithDescription() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(true);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Checkbox
        label="I accept the terms of service"
        description="You can cancel anytime from Billing; unused credit is refunded pro rata."
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
        error={submitted && !accepted ? 'Accept the terms to create your workspace.' : undefined}
        required
      />
      <div>
        <Button type="submit">Create workspace</Button>
      </div>
    </form>
  );
}
