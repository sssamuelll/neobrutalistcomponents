import type { ComponentMeta } from '../types';

export const TextareaMeta: ComponentMeta = {
  name: 'Textarea',
  slug: 'textarea',
  group: 'Forms',
  summary:
    'A multi-line text field with the same label, description and error API as Input; it grows with its content, starting from `rows` lines.',
  whenToUse: [
    'Free-form text that can run past one line: release notes, comments, bios, invite messages.',
    'Any long answer that needs a visible label and inline validation.',
  ],
  whenNotToUse: [
    'Short single-line values such as names, emails or URLs — use Input.',
    'Choosing from a known list — use Select or RadioGroup.',
    'Rich text with formatting — Textarea is plain text only.',
  ],
  extends: "ComponentProps<'textarea'>",
  props: [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Font size and padding (14 / 16 / 18px text). The height follows `rows` and the content, not a fixed control height.',
    },
    { name: 'label', type: 'ReactNode', description: 'Visible label, associated with the textarea through htmlFor/id.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field, linked with aria-describedby.' },
    {
      name: 'error',
      type: 'ReactNode | boolean',
      description: 'Invalid state. A message replaces the description and is announced with the field; true marks the field invalid and keeps the description.',
    },
    {
      name: 'autoResize',
      type: 'boolean',
      default: 'true',
      description: 'Grows with its content using CSS field-sizing, up to 24 lines; `rows` is the minimum height. Browsers without field-sizing show `rows` lines and scroll.',
    },
  ],
  classes: [
    'nbc-field',
    'nbc-field__label',
    'nbc-field__required',
    'nbc-field__message',
    'nbc-field__message--error',
    'nbc-textarea',
    'nbc-textarea--sm',
    'nbc-textarea--lg',
    'nbc-textarea--auto',
    'nbc-textarea--invalid',
    'nbc-textarea--disabled',
  ],
  accessibility: [
    'The label is a real <label for>; an id is generated when you do not pass one.',
    'description and error messages are linked through aria-describedby; your own aria-describedby ids are kept.',
    'error sets aria-invalid="true". The required marker (*) is aria-hidden; the native required attribute carries the meaning.',
    'className goes on the wrapper; ref, rows and every other prop go on the <textarea>. Vertical resizing stays available to the user.',
  ],
  rules: [
    'Prefer Textarea over Input whenever answers can exceed one line.',
    'Always give a visible label. Placeholders are examples, not labels.',
    'Show the limit before the user hits it: put the live count in the description, and switch to an error message only when it is exceeded.',
    'Set `rows` to the typical answer length (3 by default); let autoResize handle longer ones instead of forcing a tall empty box.',
    'Fields in the same form share one size.',
  ],
  examples: [
    { file: 'Basic', title: 'Label and description' },
    { file: 'Validation', title: 'Character limit', description: 'A live count in the description; an error message once the limit is exceeded.' },
    { file: 'Sizes', title: 'Sizes', description: 'sm, md and lg change the type size and padding; rows sets the minimum height.' },
    { file: 'FixedHeight', title: 'Fixed height', description: 'autoResize={false} keeps the height at `rows` and scrolls.' },
  ],
};
