import { useState } from 'react';
import { Checkbox } from 'neobrutalistcomponents';

const CHANNELS = ['Email', 'Slack', 'SMS'] as const;

export default function Indeterminate() {
  const [selected, setSelected] = useState<string[]>(['Email', 'Slack']);
  const all = selected.length === CHANNELS.length;

  function toggle(channel: string, on: boolean) {
    setSelected((prev) => (on ? [...prev, channel] : prev.filter((c) => c !== channel)));
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox
        label="All deploy alerts"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onChange={(e) => setSelected(e.target.checked ? [...CHANNELS] : [])}
      />
      <div style={{ display: 'grid', gap: 10, paddingInlineStart: 30 }}>
        {CHANNELS.map((channel) => (
          <Checkbox
            key={channel}
            size="sm"
            label={channel}
            checked={selected.includes(channel)}
            onChange={(e) => toggle(channel, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
}
