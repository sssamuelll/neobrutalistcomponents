import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown';

/** Drops the newlines marked puts between block tags. */
const flat = (html: string) => html.replace(/>\n+</g, '><').trim();

describe('renderMarkdown', () => {
  it('renders headings, paragraphs, lists and block quotes', () => {
    const md = '## Origins\n\nThe word starts\nin concrete.\n\n- one\n- two\n\n> A quoted line\n> that continues.\n\n### Later';
    expect(flat(renderMarkdown(md))).toBe(
      '<h2>Origins</h2><p>The word starts\nin concrete.</p><ul><li>one</li><li>two</li></ul><blockquote><p>A quoted line\nthat continues.</p></blockquote><h3>Later</h3>',
    );
  });

  it('renders emphasis, code, https links in a new tab and source markers', () => {
    expect(flat(renderMarkdown('*béton brut*, **raw**, `code`, [Tate](https://www.tate.org.uk/) [2].'))).toBe(
      '<p><em>béton brut</em>, <strong>raw</strong>, <code>code</code>, <a href="https://www.tate.org.uk/" target="_blank" rel="noreferrer">Tate</a> <span class="study-cite">[2]</span>.</p>',
    );
  });

  it('leaves a lone asterisk alone and keeps parentheses in URLs', () => {
    const md = 'Grade II* [4]. The *New Brutalism* [1][2], [Metabolism](https://en.wikipedia.org/wiki/Metabolism_(architecture)).';
    expect(flat(renderMarkdown(md))).toBe(
      '<p>Grade II* <span class="study-cite">[4]</span>. The <em>New Brutalism</em> <span class="study-cite">[1]</span><span class="study-cite">[2]</span>, <a href="https://en.wikipedia.org/wiki/Metabolism_(architecture)" target="_blank" rel="noreferrer">Metabolism</a>.</p>',
    );
  });

  it('links nothing but https', () => {
    const html = renderMarkdown('[x](javascript:alert(1)) and [y](http://example.org)');
    expect(html).not.toContain('<a ');
    expect(flat(html)).toBe('<p>x and y</p>');
  });

  it('refuses raw HTML and an h1: essays are Markdown, and the page owns the h1', () => {
    expect(() => renderMarkdown('Text <b>bold</b>.')).toThrow(/raw HTML is not allowed/);
    expect(() => renderMarkdown('<div>\nblock\n</div>')).toThrow(/raw HTML is not allowed/);
    expect(() => renderMarkdown('# Title')).toThrow(/use ## and ###/);
  });
});
