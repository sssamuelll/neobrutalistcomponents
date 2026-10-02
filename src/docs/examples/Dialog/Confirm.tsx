import { useState } from 'react';
import { Button, Dialog } from 'neobrutalistcomponents';

export default function Confirm() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Dialog open={open} onOpenChange={setOpen} size="sm">
        <Dialog.Header>
          <Dialog.Title>Delete “Atlas API”?</Dialog.Title>
          <Dialog.Description>This removes 14 deployments and 3 environments. It cannot be undone.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Keep project
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Delete project
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}
