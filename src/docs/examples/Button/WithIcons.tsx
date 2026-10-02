import { Button } from 'neobrutalistcomponents';
import { ArrowRight, Plus, Search, Trash2 } from 'lucide-react';

export default function WithIcons() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
      <Button variant="secondary" leftIcon={<Plus />}>
        New invoice
      </Button>
      <Button rightIcon={<ArrowRight />}>Continue</Button>
      <Button variant="secondary" leftIcon={<Search />} aria-label="Search" />
      <Button variant="danger" leftIcon={<Trash2 />} aria-label="Delete row" />
    </div>
  );
}
