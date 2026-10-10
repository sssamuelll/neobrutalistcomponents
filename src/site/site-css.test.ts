import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(process.cwd(), 'src/site/site.css'), 'utf8');

describe('site.css', () => {
  // A study theme can bring a single-weight face; a fixed heavy weight makes the browser fake the bold.
  it('takes heavy weights from the theme’s tokens, never a fixed number', () => {
    expect(css.match(/font-weight:\s*([5-9]00|bold|bolder)\b/g) ?? []).toEqual([]);
  });
});
