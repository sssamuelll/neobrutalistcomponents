import { useState } from 'react';
import { Select } from 'neobrutalistcomponents';

export default function Validation() {
  const [timezone, setTimezone] = useState('');

  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        label="Invoice timezone"
        placeholder="Choose a timezone"
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        description="Invoices are issued at midnight in this timezone."
        error={timezone ? undefined : 'Pick the timezone your invoices are issued in.'}
        required
      >
        <option value="America/New_York">New York (UTC−5)</option>
        <option value="Europe/Berlin">Berlin (UTC+1)</option>
        <option value="Asia/Singapore">Singapore (UTC+8)</option>
        <option value="Australia/Sydney">Sydney (UTC+10)</option>
      </Select>
    </div>
  );
}
