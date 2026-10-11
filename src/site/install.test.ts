import { describe, expect, it } from 'vitest';
import { INSTALL_COMMAND, installCode } from './install';

describe('install lines', () => {
  it('installs the package by its name', () => {
    expect(INSTALL_COMMAND).toBe('npm install neobrutalistcomponents');
  });

  it('imports the styles, the theme and its fonts, and names the theme in the provider', () => {
    const code = installCode('dragon-quest', true);
    expect(code).toContain("import 'neobrutalistcomponents/styles.css';");
    expect(code).toContain("import 'neobrutalistcomponents/themes/dragon-quest.css';");
    expect(code).toContain("import 'neobrutalistcomponents/themes/dragon-quest.fonts.css'; // optional: loads the theme’s fonts");
    expect(code).toContain('<NeoProvider theme="dragon-quest">');
  });

  it('says when a theme has no fonts to load', () => {
    expect(installCode('carlton', false)).toContain('// system fonts: nothing to load');
  });
});
