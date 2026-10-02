import { useState } from 'react';
import { Alert, Button } from 'neobrutalistcomponents';

export default function Live() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <div>
        <Button
          onClick={() => {
            setSaved(true);
          }}
        >
          Save project settings
        </Button>
      </div>
      {saved && (
        <Alert role="status" variant="success" title="Settings saved" onDismiss={() => setSaved(false)}>
          Your changes to Acme Dashboard are live for everyone on the team.
        </Alert>
      )}
    </div>
  );
}
