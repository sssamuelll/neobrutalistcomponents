import type { ComponentType } from 'react';

// Live modules and their source text come from the same files, so the code
// shown next to every preview is exactly what renders.
const liveExamples = import.meta.glob<{ default: ComponentType }>('../../docs/examples/*/*.tsx', { eager: true });
const rawExamples = import.meta.glob<string>('../../docs/examples/*/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const liveBlocks = import.meta.glob<{ default: ComponentType }>('../../docs/blocks/*.tsx', { eager: true });
const rawBlocks = import.meta.glob<string>('../../docs/blocks/*.tsx', { eager: true, query: '?raw', import: 'default' });

export interface Source {
  Component: ComponentType;
  code: string;
}

export function getExample(component: string, file: string): Source | undefined {
  const key = `../../docs/examples/${component}/${file}.tsx`;
  const Component = liveExamples[key]?.default;
  return Component ? { Component, code: rawExamples[key] } : undefined;
}

export function getBlock(name: string): Source | undefined {
  const key = `../../docs/blocks/${name}.tsx`;
  const Component = liveBlocks[key]?.default;
  return Component ? { Component, code: rawBlocks[key] } : undefined;
}
