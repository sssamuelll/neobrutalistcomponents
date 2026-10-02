import { useState } from 'react';
import { Input } from 'neobrutalistcomponents';

export default function Validation() {
  const [slug, setSlug] = useState('Acme Relaunch');
  const [touched, setTouched] = useState(true);
  const valid = /^[a-z0-9-]+$/.test(slug);

  return (
    <div style={{ maxWidth: 360 }}>
      <Input
        label="Project slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        onBlur={() => setTouched(true)}
        description="Lowercase letters, numbers and dashes."
        error={touched && !valid ? 'Use lowercase letters, numbers and dashes — e.g. acme-relaunch.' : undefined}
      />
    </div>
  );
}
