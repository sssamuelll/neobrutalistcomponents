import type { ComponentMeta } from '../types';
import { GROUP_ORDER } from '../types';
import { ButtonMeta } from './Button';
import { CardMeta } from './Card';
import { InputMeta } from './Input';

const ALL: ComponentMeta[] = [ButtonMeta, InputMeta, CardMeta];

/** Every documented component, in navigation order (group, then name). */
export const COMPONENTS: readonly ComponentMeta[] = [...ALL].sort(
  (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.name.localeCompare(b.name),
);

export function findComponent(slug: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
