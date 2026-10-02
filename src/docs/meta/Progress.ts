import type { ComponentMeta } from '../types';

export const ProgressMeta: ComponentMeta = {
  name: 'Progress',
  slug: 'progress',
  group: 'Display',
  summary:
    'A bar that shows how far a task has gone, or that it is still running when the end is unknown: four variants, three sizes, an optional label and percentage.',
  whenToUse: [
    'Show the advance of a task with a known end: an upload, an import, a build, an onboarding checklist.',
    'Show that something is running when you cannot say how far along it is: provisioning a database, waiting for DNS (leave value out).',
    'Show consumption against a limit: storage used, seats taken, build minutes left (use the success, warning and danger variants).',
  ],
  whenNotToUse: [
    'A wait shorter than about a second — show nothing, or put loading on the Button that started it.',
    'A value that is not progress toward a goal, like a rating or a poll result — draw it as a chart.',
    'A task the user must be able to pause or cancel — pair Progress with a Button, it has no controls of its own.',
  ],
  extends: "Omit<ComponentProps<'div'>, 'children'>",
  props: [
    {
      name: 'value',
      type: 'number | null',
      description:
        'Current value from 0 to max, clamped to that range. Leave it out (or pass null) for an indeterminate bar.',
    },
    {
      name: 'max',
      type: 'number',
      default: '100',
      description: 'Value that means 100%. Anything that is not a positive number falls back to 100.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Visible label above the bar. It names the progressbar through aria-labelledby; without it, pass aria-label.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Show the rounded percentage at the end of the header. Ignored while indeterminate.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Bar height 8 / 14 / 22px.',
    },
    {
      name: 'variant',
      type: "'primary' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Meaning of the bar. primary = work in flight; success / warning / danger = a quota or a result.',
    },
  ],
  classes: [
    'nbc-progress',
    'nbc-progress--sm',
    'nbc-progress--md',
    'nbc-progress--lg',
    'nbc-progress--primary',
    'nbc-progress--success',
    'nbc-progress--warning',
    'nbc-progress--danger',
    'nbc-progress--indeterminate',
    'nbc-progress__header',
    'nbc-progress__label',
    'nbc-progress__value',
    'nbc-progress__track',
    'nbc-progress__bar',
  ],
  accessibility: [
    'Renders role="progressbar" with aria-valuemin 0, aria-valuemax and aria-valuenow (the clamped value, in the same unit as max).',
    'Every progressbar needs a name: pass label (linked with aria-labelledby) or, without a visible label, aria-label.',
    'Determinate bars set aria-valuetext to the rounded percentage ("42%"); pass your own aria-valuetext when a sentence reads better ("3 of 4 files uploaded").',
    'Indeterminate bars (no value) omit aria-valuenow and aria-valuetext, which is how assistive tech knows the progress is unknown.',
    'Screen readers do not announce a progressbar as it changes. For long tasks, announce the milestones ("Upload complete") in a role="status" region.',
    'The variant colors are never the only carrier: show the number (showValue) or the state in the label, e.g. "Build minutes — 100% used".',
    'In forced-colors mode the bar paints with the system Highlight color and the track keeps its border, so the filled part stays visible.',
    'The sliding animation of the indeterminate bar stops under prefers-reduced-motion; the bar stays as a static block.',
  ],
  rules: [
    'Give every Progress a label or an aria-label.',
    'Leave value out when you do not know the end; never fake a determinate value.',
    'Use max for natural units (3 of 4 files) and let the component compute the percentage.',
    'Reserve success / warning / danger for quotas and finished states; use primary for work in flight.',
    'Show the percentage (showValue) when the exact number helps the user decide; skip it for background work.',
    'Do not put interactive controls inside the header; place a Button next to the Progress instead.',
  ],
  examples: [
    { file: 'Determinate', title: 'Determinate', description: 'An upload at 42% with a label and value, a file count with a custom max, and a small unlabeled bar.' },
    { file: 'Indeterminate', title: 'Indeterminate', description: 'No value: a block slides along the track while the amount of work is unknown.' },
    { file: 'Variants', title: 'Variants', description: 'Quota usage — storage on success, seats on warning, build minutes on danger.' },
    { file: 'Live', title: 'Live', description: 'A button starts an export; the bar animates from 0 to 100 and turns green when it finishes.' },
  ],
};
