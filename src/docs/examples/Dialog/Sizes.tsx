import { useState } from 'react';
import { Button, Dialog } from 'neobrutalistcomponents';
import type { DialogSize } from 'neobrutalistcomponents';

const COPY: Record<DialogSize, { title: string; body: string }> = {
  sm: { title: 'Invite sent', body: 'maria@northwind.io will get an email with a link that expires in 7 days.' },
  md: {
    title: 'Deploy to production',
    body: 'Build #482 passed all checks. Deploying replaces the live version of Atlas API in about two minutes.',
  },
  lg: {
    title: 'Billing summary',
    body: 'Team plan, 12 seats at $18 each, billed monthly. Your next invoice of $216.00 is due on 1 November and will be charged to the card ending 4242.',
  },
};

export default function Sizes() {
  const [size, setSize] = useState<DialogSize | null>(null);
  const current = size ?? 'md';

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} variant="secondary" onClick={() => setSize(s)}>
            Open {s}
          </Button>
        ))}
      </div>
      <Dialog open={size !== null} onOpenChange={(open) => !open && setSize(null)} size={current}>
        <Dialog.Header>
          <Dialog.Title>{COPY[current].title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Content>{COPY[current].body}</Dialog.Content>
        <Dialog.Footer>
          <Button onClick={() => setSize(null)}>Got it</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
