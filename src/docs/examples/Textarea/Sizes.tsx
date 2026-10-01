import { Textarea } from 'neobrutalistcomponents';

export default function Sizes() {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 440 }}>
      <Textarea size="sm" label="Internal comment" placeholder="Visible to your team only" rows={2} />
      <Textarea size="md" label="Deploy message" placeholder="Why does this release matter?" />
      <Textarea size="lg" label="Project brief" placeholder="Goals, audience and deadlines" rows={4} />
    </div>
  );
}
