import type { ComponentMeta } from '../types';

export const SelectMeta: ComponentMeta = {
  name: 'Select',
  slug: 'select',
  group: 'Forms',
  summary:
    'A native dropdown with its label, description and error message built in, a drawn chevron, and a fully themed list wherever the browser supports it.',
  whenToUse: [
    'Choosing one value from a known list of roughly 4 to 15 options: regions, roles, plans, billing cycles, timezones.',
    'Forms where the native control matters: mobile pickers, keyboard type-ahead and autofill all keep working.',
    'Long lists that benefit from optgroups (timezones by continent, plans by billing cycle).',
  ],
  whenNotToUse: [
    'Two to four options that should all stay visible — use RadioGroup.',
    'A yes/no setting — use Checkbox or Switch.',
    'Searchable or very long lists, multi-select, or options with rich content — Select is a single-choice native control.',
  ],
  extends: "Omit<ComponentProps<'select'>, 'size' | 'multiple'>",
  props: [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32 / 40 / 48px, matching Button and Input of the same size.' },
    { name: 'label', type: 'ReactNode', description: 'Visible label, associated with the select through htmlFor/id.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field, linked with aria-describedby.' },
    {
      name: 'error',
      type: 'ReactNode | boolean',
      description: 'Invalid state. A message replaces the description and is announced with the field; true marks the field invalid and keeps the description.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Renders a first, disabled option with value "" so the field starts unanswered. Skipped when value or defaultValue is given.',
    },
  ],
  classes: [
    'nbc-field',
    'nbc-field__label',
    'nbc-field__required',
    'nbc-field__message',
    'nbc-field__message--error',
    'nbc-select',
    'nbc-select--sm',
    'nbc-select--lg',
    'nbc-select--invalid',
    'nbc-select--disabled',
    'nbc-select__control',
    'nbc-select__chevron',
  ],
  accessibility: [
    'It is a real <select>: the platform provides the combobox role, keyboard handling (arrows, type-ahead, Home/End) and mobile pickers.',
    'The label is a real <label for>; an id is generated when you do not pass one.',
    'description and error messages are linked through aria-describedby; your own aria-describedby ids are kept.',
    'error sets aria-invalid="true". The required marker (*) is aria-hidden; the native required attribute carries the meaning.',
    'The chevron is decorative and aria-hidden. In the themed list the selected option also shows a checkmark, so selection is never color alone.',
    'className goes on the wrapper; ref and every other prop go on the <select>.',
  ],
  rules: [
    'Pass options as native <option> and <optgroup> children. There is no options prop.',
    'Always give a visible label. The placeholder is a prompt, not a label; it is disabled and cannot be picked again.',
    'With placeholder, leave value and defaultValue out to start unanswered. A controlled value of "" shows the placeholder too.',
    'An option with value="" that is not disabled (for example "All regions") also reads muted while selected.',
    'Fields in the same row share one size; a Select, an Input and a Button of that size line up exactly.',
    'One value only: multiple is not supported. Use Checkbox for several choices.',
  ],
  examples: [
    { file: 'Basic', title: 'Label, placeholder and description' },
    { file: 'Grouped', title: 'Option groups', description: 'optgroup splits one list into labelled sections.' },
    { file: 'WithInput', title: 'Next to an Input and a Button', description: 'Same size, same height — in every theme.' },
    { file: 'Validation', title: 'Validation', description: 'error with a message replaces the description.' },
  ],
};
