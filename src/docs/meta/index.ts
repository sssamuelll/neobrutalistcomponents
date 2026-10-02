import type { ComponentMeta } from '../types';
import { GROUP_ORDER } from '../types';

// Every src/docs/meta/<Component>.ts exports exactly one `<Component>Meta`.
// Collected with import.meta.glob so adding a component never edits this file
// (works in Vite, Vitest and Vite's runnerImport used by scripts/gen-llms.mjs).
const modules = import.meta.glob<Record<string, ComponentMeta>>(['./*.ts', '!./index.ts'], { eager: true });

const ALL: ComponentMeta[] = Object.values(modules).flatMap((mod) => Object.values(mod));

/** Every documented component, in navigation order (group, then name). */
export const COMPONENTS: readonly ComponentMeta[] = [...ALL].sort(
  (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.name.localeCompare(b.name),
);

export function findComponent(slug: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
