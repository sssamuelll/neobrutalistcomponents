import type { ComponentMeta } from '../types';

export const BadgeMeta: ComponentMeta = {
  name: 'Badge',
  slug: 'badge',
  group: 'Display',
  summary:
    'A small sticker that labels a status or a category: seven variants, two sizes, and room for a leading icon.',
  whenToUse: [
    'Show the state of an object next to its name: Live, Failed, Draft, Synced.',
    'Tag something with a short category or release stage: Beta, New, v2.4.0.',
    'Annotate a table row, a card title or a list item without taking a line of its own.',
  ],
  whenNotToUse: [
    'A message the user must read or act on — use Alert.',
    'Anything clickable or removable — use Button, or a link styled as one.',
    'Counts that update live inside a notification pill — render the number as plain text in a status region instead.',
  ],
  extends: "ComponentProps<'span'>",
  props: [
    {
      name: 'variant',
      type: "'neutral' | 'primary' | 'accent' | 'info' | 'success' | 'warning' | 'danger'",
      default: "'neutral'",
      description:
        'Meaning of the sticker. neutral = plain label; primary = highlight (New); accent = release stage (Beta); info / success / warning / danger = state.',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      default: "'md'",
      description: 'Block size 20 / 24px. sm for dense rows and for use inside running text.',
    },
  ],
  classes: [
    'nbc-badge',
    'nbc-badge--neutral',
    'nbc-badge--primary',
    'nbc-badge--accent',
    'nbc-badge--info',
    'nbc-badge--success',
    'nbc-badge--warning',
    'nbc-badge--danger',
    'nbc-badge--sm',
  ],
  accessibility: [
    'Renders a plain <span>: purely presentational, no role. It is read in flow with the text around it.',
    'Color is never the only carrier — the label says "Failed", not just red. Keep the word, even next to an icon.',
    'Icons inside a badge are sized to 1em; mark decorative ones aria-hidden="true".',
    'A badge whose text changes while the page is open (a deploy going from Building to Live) is not announced; add role="status" if the change matters.',
    'Text on every filled variant uses the matching -fg token, which meets WCAG AA in all five themes and both color modes.',
  ],
  rules: [
    'One or two words, never a sentence. If it needs a full line, it is not a badge.',
    'Name the state, not the color: "Degraded", not "Orange".',
    'Use the status variants only for state (info, success, warning, danger); use neutral, primary and accent for categories.',
    'Use size sm when the badge sits beside body text or in a dense row; md next to titles.',
    'Do not stack more than three badges next to one title.',
  ],
  examples: [
    { file: 'Variants', title: 'Variants', description: 'Neutral, primary, accent and the four status colors.' },
    { file: 'Sizes', title: 'Sizes', description: 'Block size 20 / 24px — sm also fits inside running text.' },
    { file: 'WithIcons', title: 'With icons', description: 'Icons are sized to the text; hide them from assistive tech and keep the word.' },
    { file: 'InContext', title: 'In context', description: 'A status badge next to each item in a card, and a "New" tag in the title.' },
  ],
};
