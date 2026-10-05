/**
 * Renders a study essay (Markdown) to HTML at build time. Site-only:
 * vite-plugin-essays.ts is the one caller, so `marked` never reaches the
 * browser or the library. Raw HTML and h1 headings are refused, links must be
 * https and open in a new tab, and `[n]` markers become citation spans.
 */
import { Marked } from 'marked';

const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      if (depth === 1) throw new Error('essays use ## and ### — the page owns the h1');
      return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
    },
    html({ text }) {
      throw new Error(`raw HTML is not allowed in essays: ${text.trim().slice(0, 40)}`);
    },
    link({ href, tokens }) {
      const label = this.parser.parseInline(tokens);
      return href.startsWith('https://') ? `<a href="${attribute(href)}" target="_blank" rel="noreferrer">${label}</a>` : label;
    },
  },
});

/** `[n]` in text — never inside a tag — becomes a citation span. */
const cite = (html: string) =>
  html.replace(/(^|>)([^<]*)/g, (_, edge: string, text: string) => edge + text.replace(/\[(\d+)\]/g, '<span class="study-cite">[$1]</span>'));

export function renderMarkdown(markdown: string): string {
  return cite(marked.parse(markdown, { async: false }));
}
