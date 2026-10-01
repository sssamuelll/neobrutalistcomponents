import type { ComponentMeta } from '../types';

export const ButtonMeta: ComponentMeta = {
  name: 'Button',
  slug: 'button',
  group: 'Actions',
  summary:
    'A pressable slab that performs an action: four variants, three sizes on the shared control scale, a loading state and icon slots.',
  whenToUse: [
    'Trigger an action in place: save, submit a form, open a dialog, delete something.',
    'A link that must read as an action (pricing CTA, "Get started") — wrap the link with asChild.',
  ],
  whenNotToUse: [
    'Navigation inside running text — use a plain link.',
    'Turning a setting on or off — use Switch.',
    'Picking one option out of several — use RadioGroup, Select or Tabs.',
  ],
  extends: "ComponentProps<'button'>",
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'danger' | 'ghost'",
      default: "'primary'",
      description: 'Visual weight. primary = the one main action; secondary = alternatives; danger = destructive; ghost = low-emphasis (cancel, toolbar).',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Height 32 / 40 / 48px — identical to Input, Select and Textarea of the same size, in every theme.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Shows the theme spinner in place of the icons, sets aria-busy and disables the button. The label stays, so the width does not jump.',
    },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the width of the container.' },
    { name: 'leftIcon', type: 'ReactNode', description: 'Icon before the label. Rendered at 1.15em and hidden from assistive tech.' },
    { name: 'rightIcon', type: 'ReactNode', description: 'Icon after the label. Rendered at 1.15em and hidden from assistive tech.' },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description:
        'Render the single child element (an <a>, a router Link) with the button classes and inner structure instead of a <button>. disabled becomes aria-disabled.',
    },
  ],
  classes: [
    'nbc-button',
    'nbc-button--primary',
    'nbc-button--secondary',
    'nbc-button--danger',
    'nbc-button--ghost',
    'nbc-button--sm',
    'nbc-button--lg',
    'nbc-button--full-width',
    'nbc-button--loading',
    'nbc-button--icon-only',
    'nbc-button__label',
    'nbc-button__icon',
    'nbc-button__spinner',
  ],
  accessibility: [
    'Defaults to type="button" so it never submits a form by accident; pass type="submit" explicitly.',
    'An icon-only button (no children, one icon) needs aria-label — the icon itself is aria-hidden.',
    'loading sets aria-busy and disabled; the accessible name does not change while loading.',
    'With asChild and disabled, the element gets aria-disabled="true" and clicks are prevented.',
    'Focus is a solid outline in the theme focus color, visible in forced-colors mode.',
  ],
  rules: [
    'One primary button per region (a card footer, a dialog, a form).',
    'In a row of buttons the primary action goes last; cancel is ghost or secondary.',
    'Label with the verb that describes the outcome: "Save changes", "Delete project" — never "OK" or "Submit".',
    'Use danger only for destructive actions, and repeat the object in the label.',
    'Buttons next to a field use the same size as the field so their heights match.',
  ],
  examples: [
    { file: 'Variants', title: 'Variants', description: 'One primary per region; the others step down in emphasis.' },
    { file: 'Sizes', title: 'Sizes', description: 'Heights 32 / 40 / 48px, shared with every form control.' },
    { file: 'WithIcons', title: 'Icons and icon-only', description: 'Icons are sized for you. With no label and one icon the button turns square — give it an aria-label.' },
    { file: 'Loading', title: 'Loading', description: 'The label stays, the spinner takes the icon slot.' },
    { file: 'AsLink', title: 'As a link', description: 'asChild hands the styles to the child element.' },
  ],
};
