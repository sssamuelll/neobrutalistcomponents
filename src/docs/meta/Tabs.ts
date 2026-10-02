import type { ComponentMeta } from '../types';

export const TabsMeta: ComponentMeta = {
  name: 'Tabs',
  slug: 'tabs',
  group: 'Overlays',
  summary:
    'Switch between views that share one place on the page, composed from Tabs.List, Tabs.Tab and Tabs.Panel. Follows the WAI-ARIA tabs pattern with automatic activation.',
  whenToUse: [
    'Peer views of one object: a project’s Overview, Deployments and Settings.',
    'Content the user compares or flips between without leaving the page.',
  ],
  whenNotToUse: [
    'Steps that must happen in order — use a stepper or separate pages.',
    'Navigation between routes — use links so the URL changes.',
    'More than about six sections — consider a sidebar.',
  ],
  extends: "Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'>",
  props: [
    { name: 'value', type: 'string', description: 'Value of the selected tab (controlled).' },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Value of the initially selected tab (uncontrolled). Defaults to the first enabled tab.',
    },
    { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the new value when the user selects a tab.' },
  ],
  subcomponents: [
    { name: 'Tabs.List', element: 'div', description: 'The tablist. Handles arrow, Home and End keys; give it an aria-label.' },
    {
      name: 'Tabs.Tab',
      element: 'button',
      description: 'One tab. Its value pairs it with a Tabs.Panel.',
      propsInterface: 'TabsTabProps',
      props: [{ name: 'value', type: 'string', description: 'Unique value that pairs this tab with its Tabs.Panel.' }],
    },
    {
      name: 'Tabs.Panel',
      element: 'div',
      description: 'Content for one tab. Inactive panels stay mounted but hidden.',
      propsInterface: 'TabsPanelProps',
      props: [{ name: 'value', type: 'string', description: 'Value of the Tabs.Tab that controls this panel.' }],
    },
  ],
  classes: ['nbc-tabs', 'nbc-tabs__list', 'nbc-tabs__tab', 'nbc-tabs__tab--active', 'nbc-tabs__panel'],
  accessibility: [
    'Roles tablist, tab and tabpanel are wired with aria-selected, aria-controls and aria-labelledby.',
    'Roving tabindex: only the active tab is in the tab order; Tab moves on to the panel.',
    'ArrowLeft / ArrowRight move focus and select (automatic activation) with wrap-around, skipping disabled tabs; Home and End jump to the ends. Arrows swap in right-to-left layouts.',
    'Give Tabs.List an aria-label when the purpose is not obvious from context.',
  ],
  rules: [
    'Keep tab labels to one or two words.',
    'Every Tabs.Tab needs exactly one Tabs.Panel with the same value.',
    'Do not put a tab in a disabled state without explaining why elsewhere on the page.',
  ],
  examples: [
    { file: 'Basic', title: 'Basic' },
    { file: 'Controlled', title: 'Controlled', description: 'External buttons drive the selected tab; a Badge counts open items.' },
    { file: 'WithDisabled', title: 'With a disabled tab' },
  ],
};
