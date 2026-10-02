/**
 * Component metadata — the single source of truth for the docs site,
 * llms.txt / llms-full.txt and the agent skill. Pure data: no JSX, no
 * runtime imports, so scripts can load it without a bundler.
 */

export interface PropDoc {
  name: string;
  /** TypeScript type as a consumer would write it. */
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface SubcomponentDoc {
  /** As used in JSX, e.g. `Card.Title`. */
  name: string;
  /** Native element rendered, e.g. `h3`. */
  element: string;
  description: string;
  /** Interface whose own members `props` must match (checked by the drift test). */
  propsInterface?: string;
  props?: PropDoc[];
}

export type ComponentGroup = 'Actions' | 'Forms' | 'Display' | 'Overlays';

export const GROUP_ORDER: readonly ComponentGroup[] = ['Actions', 'Forms', 'Display', 'Overlays'];

export interface ExampleDoc {
  /** File name without extension under src/docs/examples/<Component>/. */
  file: string;
  title: string;
  description?: string;
}

export interface ComponentMeta {
  /** Export name, e.g. `RadioGroup`. Also the folder name under src/lib. */
  name: string;
  /** URL segment, kebab-case of `name`. */
  slug: string;
  group: ComponentGroup;
  /** One sentence: what it is. */
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  /** The native props the component extends, e.g. `ComponentProps<'button'>`. */
  extends: string;
  /** Exactly the own members of `<name>Props` (checked by the drift test). */
  props: PropDoc[];
  subcomponents?: SubcomponentDoc[];
  /** Public BEM class hooks, stable across minor versions. */
  classes: string[];
  accessibility: string[];
  /** Composition rules that keep interfaces consistent. */
  rules: string[];
  examples: ExampleDoc[];
}
