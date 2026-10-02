import type { ComponentMeta } from '../types';

export const CardMeta: ComponentMeta = {
  name: 'Card',
  slug: 'card',
  group: 'Display',
  summary:
    'A bordered slab that groups related content, composed from Card.Header, Card.Title, Card.Description, Card.Content and Card.Footer.',
  whenToUse: [
    'Group one object or one task: a plan, a project, a settings section, a form.',
    'Lists of comparable items (with as="li" inside a <ul>).',
    'A whole-card link to a detail page (variant="interactive" with a link in the title).',
  ],
  whenNotToUse: [
    'As page layout for everything — not every section needs a frame.',
    'Status messages — use Alert.',
    'Modal content — use Dialog.',
  ],
  extends: "Omit<ComponentProps<'div'>, 'ref'>",
  props: [
    {
      name: 'variant',
      type: "'default' | 'elevated' | 'interactive'",
      default: "'default'",
      description: 'elevated casts the large shadow; interactive presses on hover and makes the title link cover the card.',
    },
    { name: 'as', type: "'div' | 'article' | 'section' | 'li'", default: "'div'", description: 'Element to render.' },
    { name: 'ref', type: 'Ref<HTMLElement>', description: 'Ref to the root element.' },
  ],
  subcomponents: [
    { name: 'Card.Header', element: 'div', description: 'Title + description block. Gets a bottom rule when content follows.' },
    {
      name: 'Card.Title',
      element: 'h3',
      description: 'Display-font heading. In an interactive card, put the link here.',
      propsInterface: 'CardTitleProps',
      props: [
        { name: 'as', type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'", default: "'h3'", description: 'Heading level that fits the page outline.' },
        { name: 'ref', type: 'Ref<HTMLHeadingElement>', description: 'Ref to the heading.' },
      ],
    },
    { name: 'Card.Description', element: 'p', description: 'Muted supporting line under the title.' },
    { name: 'Card.Content', element: 'div', description: 'Padded body; grows to fill the card height.' },
    { name: 'Card.Footer', element: 'div', description: 'Action tray, right-aligned. Stays clickable above an interactive card link.' },
  ],
  classes: [
    'nbc-card',
    'nbc-card--elevated',
    'nbc-card--interactive',
    'nbc-card__header',
    'nbc-card__title',
    'nbc-card__description',
    'nbc-card__content',
    'nbc-card__footer',
  ],
  accessibility: [
    'Interactive cards use the stretched-link pattern: the only interactive element is the real link in Card.Title, so keyboard and screen-reader users get one stop with a meaningful name.',
    'The card shows the focus ring when its title link is focused (:has(:focus-visible)).',
    'Choose the title level (as) so headings stay in order on the page.',
  ],
  rules: [
    'One idea per card; the title names it in a few words.',
    'At most one primary button in a card footer, placed last.',
    'Cards in the same grid use the same variant; reserve elevated for the one card that matters most.',
    'Never nest cards inside cards.',
  ],
  examples: [
    { file: 'Composition', title: 'Composition' },
    { file: 'Variants', title: 'Variants' },
    { file: 'Interactive', title: 'Interactive list', description: 'Each card is one link; the footer stays independent.' },
  ],
};
