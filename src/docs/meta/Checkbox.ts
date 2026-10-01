import type { ComponentMeta } from '../types';

export const CheckboxMeta: ComponentMeta = {
  name: 'Checkbox',
  slug: 'checkbox',
  group: 'Forms',
  summary:
    'A real native checkbox drawn as a brutalist box with check and mixed glyphs, with its label, description and error message built in.',
  whenToUse: [
    'An independent yes/no choice that is saved on submit: consent, notification preferences, feature opt-ins.',
    'Picking any number of options from a short list.',
    'A select-all parent over a group of checkboxes, using the mixed state.',
  ],
  whenNotToUse: [
    'A setting that takes effect the moment it flips — use Switch.',
    'Choosing exactly one option — use RadioGroup or Select.',
    'Long lists of options that need search — use Select.',
  ],
  extends: "Omit<ComponentProps<'input'>, 'type' | 'size'>",
  props: [
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Box size: 18px (sm) or 22px (md). Label text follows.' },
    { name: 'label', type: 'ReactNode', description: 'Visible label, associated with the checkbox through htmlFor/id. Clicking it toggles the box.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the label, linked with aria-describedby.' },
    {
      name: 'error',
      type: 'ReactNode | boolean',
      description: 'Invalid state. A message replaces the description and is announced with the checkbox; true marks it invalid and keeps the description.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      description: 'Mixed state for a parent of partially selected children. Sets the DOM property, so assistive tech announces "mixed". Drive it from state: a click clears the native flag.',
    },
  ],
  classes: [
    'nbc-checkbox',
    'nbc-checkbox--sm',
    'nbc-checkbox--invalid',
    'nbc-checkbox--disabled',
    'nbc-checkbox__box',
    'nbc-checkbox__control',
    'nbc-checkbox__check',
    'nbc-checkbox__dash',
    'nbc-checkbox__text',
    'nbc-checkbox__label',
    'nbc-checkbox__required',
    'nbc-checkbox__message',
    'nbc-checkbox__message--error',
  ],
  accessibility: [
    'It is a native <input type="checkbox">: keyboard (Space), focus, form submission and autofill all work. The drawn box is decoration over it.',
    'The label is a real <label for>; an id is generated when you do not pass one. Without a label, pass aria-label.',
    'description and error messages are linked through aria-describedby; your own aria-describedby ids are kept.',
    'error sets aria-invalid="true". The required marker (*) is aria-hidden; the native required attribute carries the meaning.',
    'indeterminate is exposed as the mixed state by the browser, with no extra ARIA attribute. In forced-colors mode a checked box uses Highlight.',
    'className goes on the wrapper; ref and every other prop go on the <input>.',
  ],
  rules: [
    'Write the label so that checked means yes: "Email me when a deploy fails", not "Disable emails".',
    'Use a checkbox for choices submitted later; use Switch when the change applies immediately.',
    'Control indeterminate from state: it is true when some but not all children are checked, and the parent toggles all of them.',
    'Put long consent copy in description, not in the label, and explain what the user must do in error messages.',
    'Stack checkboxes vertically with consistent spacing; mix sizes only to show hierarchy, as with a parent and its children.',
  ],
  examples: [
    { file: 'Basic', title: 'Basic', description: 'Unchecked, checked and disabled.' },
    { file: 'WithDescription', title: 'Consent with description and error', description: 'The error appears when the form is submitted unchecked.' },
    { file: 'Indeterminate', title: 'Select all', description: 'A controlled parent showing the mixed state over three channels.' },
    { file: 'Sizes', title: 'Sizes', description: 'md for forms, sm for dense lists.' },
  ],
};
