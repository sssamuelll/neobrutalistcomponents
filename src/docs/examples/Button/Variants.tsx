import { Button } from 'neobrutalistcomponents';

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Button variant="primary">Save changes</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button variant="danger">Delete project</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  );
}
