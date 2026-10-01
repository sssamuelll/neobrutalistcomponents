import type { ComponentMeta } from '../types';

export const SwitchMeta: ComponentMeta = {
  name: 'Switch',
  slug: 'switch',
  group: 'Forms',
  summary:
    'A native checkbox with the switch role, drawn as a brutalist track and thumb, for settings that take effect the moment they flip.',
  whenToUse: [
    'A setting that applies immediately, with no Save button: deploy previews, dark mode, email notifications.',
    'A binary preference in a settings list, where the label describes the feature and on means enabled.',
    'Turning a feature or integration on and off while the user stays on the page.',
  ],
  whenNotToUse: [
    'A choice that is only saved when a form is submitted — use Checkbox.',
    'Choosing one option out of several — use RadioGroup or Select.',
    'A selection that can be partially applied, like a select-all parent — use Checkbox with indeterminate.',
    'A switch whose action is destructive or needs confirmation — use a Button that opens a confirmation instead.',
  ],
  extends: "Omit<ComponentProps<'input'>, 'type' | 'size' | 'role'>",
  props: [
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track size: 36x20px (sm) or 46x26px (md). Label text follows.' },
    { name: 'label', type: 'ReactNode', description: 'Visible label, associated with the switch through htmlFor/id. Clicking it toggles the switch.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the label, linked with aria-describedby.' },
  ],
  classes: [
    'nbc-switch',
    'nbc-switch--sm',
    'nbc-switch--disabled',
    'nbc-switch__track',
    'nbc-switch__control',
    'nbc-switch__thumb',
    'nbc-switch__text',
    'nbc-switch__label',
    'nbc-switch__description',
  ],
  accessibility: [
    'It is a native <input type="checkbox" role="switch">: keyboard (Space), focus, form submission and autofill all work. The drawn track and thumb are decoration over it.',
    'Screen readers announce it as a switch that is on or off. The state comes from the native checked property, so there is no aria-checked to keep in sync.',
    'The label is a real <label for>; an id is generated when you do not pass one. Without a label, pass aria-label.',
    'description is linked through aria-describedby; your own aria-describedby ids are kept.',
    'There is no error state: a switch applies immediately, so it is never invalid. type and role are fixed and cannot be overridden.',
    'In forced-colors mode the track uses Highlight when on and the thumb uses HighlightText, so the state stays visible. The thumb also moves, so state never depends on color alone.',
    'className goes on the wrapper; ref and every other prop go on the <input>.',
  ],
  rules: [
    'Write the label as the feature, so that on means enabled: "Deploy previews", not "Disable previews".',
    'Use a switch only when the change applies as soon as it flips; if the user must press Save, use a Checkbox.',
    'Put the effect in description when it is not obvious: "Every pull request gets its own URL."',
    'Do not change the label when the state changes; the switch already says whether it is on.',
    'Stack switches vertically with consistent spacing, and use size sm only in dense lists.',
  ],
  examples: [
    { file: 'Basic', title: 'Basic', description: 'Off, on and disabled.' },
    { file: 'Settings', title: 'Settings list', description: 'Three switches with descriptions inside a Card, each applying immediately.' },
    { file: 'Sizes', title: 'Sizes', description: 'md for settings pages, sm for dense lists.' },
  ],
};
