import { useState } from 'react';
import { Alert, Button } from 'neobrutalistcomponents';

export default function WithAction() {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      {visible ? (
        <Alert
          variant="warning"
          title="3 teammates have not accepted their invite"
          action={<Button size="sm">Resend invites</Button>}
          onDismiss={() => setVisible(false)}
          dismissLabel="Dismiss invite reminder"
        >
          Invites expire after 7 days. Resend them to keep seats reserved.
        </Alert>
      ) : (
        <div>
          <Button variant="secondary" size="sm" onClick={() => setVisible(true)}>
            Show the reminder again
          </Button>
        </div>
      )}
    </div>
  );
}
