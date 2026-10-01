import type { ComponentMeta } from '../types';

export const AlertMeta: ComponentMeta = {
  name: 'Alert',
  slug: 'alert',
  group: 'Display',
  summary:
    'An inline message about the state of the page or a task: four variants with a status icon and edge stripe, an optional title, action and dismiss button.',
  whenToUse: [
    'Tell the user the result of something that just happened: saved, deployed, payment failed.',
    'Warn about a condition on the page before they act: a trial ending, an expiring invite, a degraded service.',
    'Offer one clear next step next to the message (a Button in the action slot).',
  ],
  whenNotToUse: [
    'A tiny label on an object (Live, Draft, Beta) — use Badge.',
    'A message that must block the user until they answer — use Dialog.',
    'Field-level validation — use the error prop on the field itself.',
  ],
  extends: "Omit<ComponentProps<'div'>, 'title'>",
  props: [
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'danger'",
      default: "'info'",
      description: 'Meaning of the message. Sets the tint, the icon chip, the edge stripe and the default icon.',
    },
    { name: 'title', type: 'ReactNode', description: 'Short heading above the description. Omit it for one-line messages.' },
    {
      name: 'icon',
      type: 'ReactNode | false',
      description: 'Replaces the default per-variant icon (info, check, triangle, octagon). false hides the icon. Always hidden from assistive tech.',
    },
    { name: 'action', type: 'ReactNode', description: 'Trailing action, usually a size="sm" Button. Centered on the first row.' },
    {
      name: 'onDismiss',
      type: '() => void',
      description: 'Renders a dismiss button that calls this. The alert does not hide itself — unmount it in the handler.',
    },
    { name: 'dismissLabel', type: 'string', default: "'Dismiss'", description: 'Accessible name of the dismiss button. Translate it, or make it specific.' },
  ],
  classes: [
    'nbc-alert',
    'nbc-alert--info',
    'nbc-alert--success',
    'nbc-alert--warning',
    'nbc-alert--danger',
    'nbc-alert__icon',
    'nbc-alert__body',
    'nbc-alert__title',
    'nbc-alert__description',
    'nbc-alert__action',
    'nbc-alert__dismiss',
  ],
  accessibility: [
    'There is no default role: a static alert is plain content, not a live region, so screen readers do not interrupt for it.',
    'When the alert appears after the page has loaded, pass role="alert" (urgent, announced immediately) or role="status" (polite, announced when the user is idle).',
    'Use role="alert" sparingly — only for errors that need attention now. Prefer role="status" for confirmations.',
    'The status icon is decorative and hidden from assistive tech; the title and text must say the meaning, never the color alone.',
    'The dismiss button is a real button named by dismissLabel (default "Dismiss"). Make it specific when several alerts are on the page.',
    'Text stays in the normal foreground color on a light tint, so contrast does not depend on the status color.',
  ],
  rules: [
    'Say what happened and what to do next: "Payment failed" + "Update your card to avoid a service pause."',
    'One alert per cause. Do not stack three alerts that say the same thing.',
    'At most one action, as a size="sm" Button; put the primary decision in it, not in the description.',
    'Use danger for failures and blocked states, warning for things that will become a problem soon, success for completed work, info for the rest.',
    'Place alerts where the user is looking: at the top of the section they affect, not at the top of the page.',
  ],
  examples: [
    { file: 'Variants', title: 'Variants', description: 'Info, success, warning and danger, each with a title and a one-line explanation.' },
    { file: 'WithAction', title: 'Action and dismiss', description: 'A warning with a small Button and a dismiss button; the parent decides when to unmount it.' },
    { file: 'Live', title: 'Announced when it appears', description: 'role="status" makes a dynamically inserted alert polite and announced.' },
  ],
};
