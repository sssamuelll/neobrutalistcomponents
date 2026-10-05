import type { Plugin } from 'vite';
import { renderMarkdown } from './src/study/markdown.ts';

const ESSAY = /\/src\/study\/essays\/[^/]+\/(es|en)\.md$/;

/** Renders the study's Markdown essays to HTML strings at build time: `import html from './es.md'`. */
export function essays(): Plugin {
  return {
    name: 'nbc-essays',
    transform(code, id) {
      if (id.includes('?') || !ESSAY.test(id)) return null;
      return { code: `export default ${JSON.stringify(renderMarkdown(code))};`, map: null };
    },
  };
}
