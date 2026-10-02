import { useState } from 'react';
import { Button } from 'neobrutalistcomponents';

export default function Loading() {
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1600);
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Button loading={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
      <Button variant="secondary" loading>
        Syncing
      </Button>
    </div>
  );
}
