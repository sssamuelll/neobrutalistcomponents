import { Textarea } from 'neobrutalistcomponents';

export default function FixedHeight() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 440 }}>
      <Textarea
        label="Invite message"
        autoResize={false}
        rows={4}
        defaultValue="Hi Ada, I added you to the Acme Relaunch workspace so you can review the staging deploys before Friday."
        description="This box keeps its height and scrolls; drag the corner to resize."
      />
    </div>
  );
}
