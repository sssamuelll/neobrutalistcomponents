import type { ComponentMeta } from '../types';

export const TooltipMeta: ComponentMeta = {
  name: 'Tooltip',
  slug: 'tooltip',
  group: 'Overlays',
  summary:
    'A short hint attached to a focusable element, shown on hover after a delay and immediately on keyboard focus, rendered in the top layer.',
  whenToUse: [
    'Naming an icon-only button ("Copy link", "Archive").',
    'A brief hint about a shortcut or a disabled reason that fits in one line.',
  ],
  whenNotToUse: [
    'Anything the user must read to complete a task — put it in the description of the field instead.',
    'Interactive content (links, buttons) — tooltips are not focusable.',
    'Touch-only interfaces: hover tooltips never appear on touch.',
  ],
  extends: '(no native props — wraps its child)',
  props: [
    { name: 'content', type: 'ReactNode', required: true, description: 'What the tooltip says. One short line.' },
    { name: 'children', type: 'ReactElement', required: true, description: 'The single focusable element the tooltip describes.' },
    { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred side; flips when there is no room.' },
    { name: 'delay', type: 'number', default: '400', description: 'Milliseconds the pointer rests on the trigger before showing.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Never show; the child renders untouched.' },
    { name: 'className', type: 'string', description: 'Extra class on the tooltip bubble.' },
  ],
  classes: ['nbc-tooltip', 'nbc-tooltip--top', 'nbc-tooltip--bottom', 'nbc-tooltip--left', 'nbc-tooltip--right', 'nbc-tooltip-anchor'],
  accessibility: [
    'The bubble has role="tooltip" and is linked to the trigger with aria-describedby (existing describedby ids are kept).',
    'Opens on keyboard focus immediately and closes on blur or Escape.',
    'The trigger keeps its own accessible name; for icon-only buttons still pass aria-label — the tooltip is a description, not a name.',
  ],
  rules: [
    'Keep it under about 60 characters, sentence case, no period for fragments.',
    'Never hide essential information in a tooltip.',
    'One tooltip per trigger; do not stack tooltips on tooltips.',
  ],
  examples: [
    { file: 'IconButtons', title: 'Naming icon buttons' },
    { file: 'Sides', title: 'Sides', description: 'Each side flips automatically near the viewport edge.' },
    { file: 'WithShortcut', title: 'With a shortcut' },
  ],
};
