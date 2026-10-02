import { Textarea } from 'neobrutalistcomponents';

export default function Basic() {
  return (
    <div style={{ maxWidth: 440 }}>
      <Textarea
        label="Release notes"
        placeholder="What changed in v2.4? Mention breaking changes first."
        description="Shown on the changelog and in the deploy email."
      />
    </div>
  );
}
