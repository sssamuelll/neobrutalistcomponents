import { useState } from 'react';
import { Textarea } from 'neobrutalistcomponents';

const LIMIT = 280;

export default function Validation() {
  const [note, setNote] = useState(
    'Moved billing to annual plans, added proration on upgrades, and fixed the invoice PDF that dropped the VAT number for EU customers. Seats are now counted per workspace instead of per project, so existing teams may see a lower total on their next invoice.',
  );
  const left = LIMIT - note.length;

  return (
    <div style={{ maxWidth: 440 }}>
      <Textarea
        label="Invoice note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        description={`${left} of ${LIMIT} characters left. Printed on the customer invoice.`}
        error={left < 0 ? `${-left} characters over the ${LIMIT} limit — trim the note before sending.` : undefined}
      />
    </div>
  );
}
