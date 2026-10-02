import { useState } from 'react';
import { Button, Dialog, Input } from 'neobrutalistcomponents';

export default function Form() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Northwind');

  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename workspace</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form method="dialog">
          <Dialog.Header>
            <Dialog.Title>Rename workspace</Dialog.Title>
            <Dialog.Description>Members see the new name straight away.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Content>
            <Input label="Workspace name" value={name} onChange={(event) => setName(event.target.value)} />
          </Dialog.Content>
          <Dialog.Footer>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save name</Button>
          </Dialog.Footer>
        </form>
      </Dialog>
    </>
  );
}
