import type { ComponentMeta } from '../types';

export const InputMeta: ComponentMeta = {
  name: 'Input',
  slug: 'input',
  group: 'Forms',
  summary:
    'A single-line text field with its label, description and error message built in, on the shared 32 / 40 / 48px control scale.',
  whenToUse: [
    'Short free-form text: names, emails, URLs, search terms, numbers.',
    'Any field that needs a visible label and inline validation.',
  ],
  whenNotToUse: [
    'More than one line of text — use Textarea.',
    'Choosing from a known list — use Select or RadioGroup.',
    'Yes/no settings — use Checkbox or Switch.',
  ],
  extends: "Omit<ComponentProps<'input'>, 'size'>",
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32 / 40 / 48px, matching Button of the same size.' },
    { name: 'label', type: 'ReactNode', description: 'Visible label, associated with the input through htmlFor/id.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field, linked with aria-describedby.' },
    {
      name: 'error',
      type: 'ReactNode | boolean',
      description: 'Invalid state. A message replaces the description and is announced with the field; true marks the field invalid and keeps the description.',
    },
    { name: 'leftIcon', type: 'ReactNode', description: 'Decorative icon at the start of the box.' },
    { name: 'rightIcon', type: 'ReactNode', description: 'Decorative icon at the end of the box.' },
  ],
  classes: [
    'nbc-field',
    'nbc-field__label',
    'nbc-field__required',
    'nbc-field__message',
    'nbc-field__message--error',
    'nbc-input',
    'nbc-input--sm',
    'nbc-input--lg',
    'nbc-input--invalid',
    'nbc-input--disabled',
    'nbc-input__control',
    'nbc-input__icon',
  ],
  accessibility: [
    'The label is a real <label for>; an id is generated when you do not pass one.',
    'description and error messages are linked through aria-describedby; your own aria-describedby ids are kept.',
    'error sets aria-invalid="true". The required marker (*) is aria-hidden; the native required attribute carries the meaning.',
    'className goes on the wrapper; ref and every other prop go on the <input>.',
  ],
  rules: [
    'Always give a visible label. Placeholders are examples, not labels.',
    'Write errors that say what to do: "Use letters, numbers and dashes", not "Invalid input".',
    'Show the error after the user leaves the field or submits, not on every keystroke.',
    'Fields in the same form share one size; put a Button of that size next to an Input for inline actions.',
  ],
  examples: [
    { file: 'Basic', title: 'Label and description' },
    { file: 'Validation', title: 'Validation', description: 'error with a message replaces the description.' },
    { file: 'Sizes', title: 'Sizes with a matching button', description: 'Same size, same height — in every theme.' },
    { file: 'WithIcons', title: 'Icons' },
  ],
};
