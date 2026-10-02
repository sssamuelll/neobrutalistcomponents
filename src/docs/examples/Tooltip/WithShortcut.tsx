import { Button, Kbd, Tooltip } from 'neobrutalistcomponents';
import { Search } from 'lucide-react';

export default function WithShortcut() {
  return (
    <Tooltip
      content={
        <>
          Search projects <Kbd size="sm">⌘</Kbd> <Kbd size="sm">K</Kbd>
        </>
      }
    >
      <Button variant="secondary" leftIcon={<Search />}>
        Search
      </Button>
    </Tooltip>
  );
}
