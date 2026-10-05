import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TAGLINE } from './guide';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

describe('public copy', () => {
  it('stops counting themes where npm and link previews read it', () => {
    const pkg = JSON.parse(read('package.json')) as { description: string };
    expect(pkg.description).toBe(TAGLINE);
    const html = read('index.html');
    expect(html).not.toMatch(/five themes/i);
    expect(html).toContain(`<meta property="og:description" content="${TAGLINE}" />`);
  });
});
