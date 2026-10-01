import type { ComponentMeta } from '../types';

export const KbdMeta: ComponentMeta = {
  name: 'Kbd',
  slug: 'kbd',
  group: 'Display',
  summary: 'A keyboard key cap for shortcuts in docs, menus and tooltips, in two sizes.',
  whenToUse: [
    'Show a keyboard shortcut next to a command in a menu, tooltip or help dialog.',
    'Name a key inside running text: "Press Esc to close".',
  ],
  whenNotToUse: [
    'Inline code, file names or commands — use a <code> element.',
    'A pressable control — use Button.',
  ],
  extends: "ComponentProps<'kbd'>",
  props: [
    {
      name: 'size',
      type: "'sm' | 'md'",
      default: "'md'",
      description: 'Key cap height 20 / 24px. Use sm inside dense menus and tooltips.',
    },
  ],
  classes: ['nbc-kbd', 'nbc-kbd--sm'],
  accessibility: [
    'Renders a native <kbd>, which assistive tech exposes as keyboard input.',
    'For a combo, nest the keys in an outer <kbd>: <kbd><Kbd>⌘</Kbd>+<Kbd>K</Kbd></kbd> is the semantic way to mark up a chord.',
    'Symbols such as ⌘ or ⏎ are read inconsistently; add a title or visually hidden text where the meaning matters.',
  ],
  rules: [
    'One Kbd per key; separate the keys of a chord with "+" or a space.',
    'Use the symbol that matches the platform (⌘ on macOS, Ctrl elsewhere).',
    'Keep the shortcut to the right of its description so the descriptions align.',
  ],
  examples: [
    { file: 'Shortcuts', title: 'Shortcut list', description: 'Four shortcuts with their descriptions.' },
    { file: 'InText', title: 'In text', description: 'A key cap inline with a sentence.' },
  ],
};
