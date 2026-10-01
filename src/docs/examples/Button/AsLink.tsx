import { Button } from 'neobrutalistcomponents';
import { ArrowUpRight } from 'lucide-react';

export default function AsLink() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <Button asChild rightIcon={<ArrowUpRight />}>
        <a href="https://github.com/sssamuelll/neobrutalistcomponents" target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </Button>
      <Button asChild variant="ghost">
        <a href="#/start">Read the setup guide</a>
      </Button>
    </div>
  );
}
