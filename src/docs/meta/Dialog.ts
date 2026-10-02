import type { ComponentMeta } from '../types';

export const DialogMeta: ComponentMeta = {
  name: 'Dialog',
  slug: 'dialog',
  group: 'Overlays',
  summary:
    'A modal dialog on the native <dialog> element: focus trap, Esc, inert background and top layer come from the platform. Controlled only.',
  whenToUse: [
    'Confirm a destructive or irreversible action (delete a project, revoke an invite).',
    'A short focused task that must finish before the user returns to the page (rename a workspace).',
    'Anything that needs the whole page to be inert while it is open.',
  ],
  whenNotToUse: [
    'Inline feedback or status — use Alert.',
    'Long multi-step flows — give them a page.',
    'Non-blocking hints — use a popover or tooltip.',
  ],
  extends: "Omit<ComponentProps<'dialog'>, 'open'>",
  props: [
    { name: 'open', type: 'boolean', required: true, description: 'Whether the dialog is shown. Controlled: the dialog never closes itself.' },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: true,
      description: 'Called with false when the user asks to close (Esc, backdrop, close button, form method="dialog").',
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Maximum inline size: sm 400px, md 560px, lg 760px.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Close when the backdrop is clicked.' },
    { name: 'hideClose', type: 'boolean', default: 'false', description: 'Hide the corner close button. Provide another way to close.' },
    { name: 'closeLabel', type: 'string', default: "'Close'", description: 'Accessible name of the corner close button.' },
  ],
  subcomponents: [
    { name: 'Dialog.Header', element: 'div', description: 'Title + description block; leaves room for the close button.' },
    { name: 'Dialog.Title', element: 'h2', description: 'Display-font heading. Names the dialog through aria-labelledby.' },
    { name: 'Dialog.Description', element: 'p', description: 'Muted supporting line. Becomes the dialog description through aria-describedby.' },
    { name: 'Dialog.Content', element: 'div', description: 'Padded body.' },
    { name: 'Dialog.Footer', element: 'div', description: 'Action tray, right-aligned; put the primary action last.' },
  ],
  classes: [
    'nbc-dialog',
    'nbc-dialog--sm',
    'nbc-dialog--lg',
    'nbc-dialog__panel',
    'nbc-dialog__close',
    'nbc-dialog__header',
    'nbc-dialog__title',
    'nbc-dialog__description',
    'nbc-dialog__content',
    'nbc-dialog__footer',
  ],
  accessibility: [
    'Opened with showModal(): focus moves into the dialog, Tab is trapped, the rest of the page is inert and Esc closes it.',
    'Dialog.Title and Dialog.Description register themselves, so aria-labelledby and aria-describedby are only set when they exist.',
    'Without a Dialog.Title, pass aria-label so the dialog still has a name.',
    'The corner close button is a real button named by closeLabel.',
  ],
  rules: [
    'Always render a Dialog.Title; keep it to a few words that name the decision.',
    'Keep open in your own state and update it in onOpenChange; Esc and backdrop clicks only ask.',
    'One primary action per dialog, last in the footer; the cancel action sits before it.',
    'Never stack dialogs; replace the content instead.',
  ],
  examples: [
    { file: 'Confirm', title: 'Confirm a destructive action' },
    { file: 'Form', title: 'Form in a dialog', description: 'A form with method="dialog" closes the dialog on submit.' },
    { file: 'Sizes', title: 'Sizes' },
  ],
};
