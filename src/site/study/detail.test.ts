import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseThemeTokens } from '../../lib/themes/color';
import { COLOR_TOKENS, FILL_TOKENS } from '../../lib/themes/contract';
import { STUDY_ENTRIES } from './data';
import { loadDetail } from './detail';

// The token tables show a study theme's colours and contrast ratios from its
// data chunk, not from a second download of its stylesheet: the two must agree.
const TABLE_TOKENS = [...COLOR_TOKENS, ...FILL_TOKENS.filter((name) => name !== '--nbc-texture')];

describe('loadDetail', () => {
  it.each(STUDY_ENTRIES.map((entry) => [entry.id, entry] as const))('%s: the tables read the colours and fills of its own stylesheet', async (id, entry) => {
    const { tokens } = await loadDetail(entry);
    const sheet = parseThemeTokens(readFileSync(join(process.cwd(), `src/study/.generated/themes/${id}.css`), 'utf8'), id);
    expect(Object.fromEntries(TABLE_TOKENS.map((name) => [name, tokens.get(name)]))).toEqual(
      Object.fromEntries(TABLE_TOKENS.map((name) => [name, sheet.get(name)])),
    );
  });
});
