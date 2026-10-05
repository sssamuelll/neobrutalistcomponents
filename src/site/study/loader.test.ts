import { afterEach, describe, expect, it } from 'vitest';
import { isKnownTheme, loadFonts, loadThemeStylesheet } from './loader';

const links = (selector: string) => [...document.head.querySelectorAll<HTMLLinkElement>(selector)];

afterEach(() => {
  for (const link of links('link')) link.remove();
});

describe('theme loader', () => {
  it('knows core and study themes, nothing else', () => {
    expect(['classic', 'riso', 'nakagin', 'classifieds'].map(isKnownTheme)).toEqual([true, true, true, true]);
    expect(['nope', 'constructor', ''].map(isKnownTheme)).toEqual([false, false, false]);
  });

  it('never fetches a core theme', async () => {
    await expect(loadThemeStylesheet('classic')).resolves.toBeUndefined();
    expect(links('link[data-nbc-theme]')).toHaveLength(0);
  });

  it('adds one stylesheet per study theme and resolves when it loads', async () => {
    const first = loadThemeStylesheet('nakagin');
    const again = loadThemeStylesheet('nakagin');
    expect(again).toBe(first);
    const added = links('link[data-nbc-theme="nakagin"]');
    expect(added).toHaveLength(1);
    expect(added[0].rel).toBe('stylesheet');
    added[0].dispatchEvent(new Event('load'));
    await expect(first).resolves.toBeUndefined();
  });

  it('removes a stylesheet that fails and tries again next time', async () => {
    const attempt = loadThemeStylesheet('sesc-pompeia');
    links('link[data-nbc-theme="sesc-pompeia"]')[0].dispatchEvent(new Event('error'));
    await expect(attempt).rejects.toThrow(/could not load the stylesheet of "sesc-pompeia"/);
    expect(links('link[data-nbc-theme="sesc-pompeia"]')).toHaveLength(0);
    void loadThemeStylesheet('sesc-pompeia').catch(() => undefined);
    expect(links('link[data-nbc-theme="sesc-pompeia"]')).toHaveLength(1);
  });

  it('rejects an unknown theme', async () => {
    await expect(loadThemeStylesheet('nope')).rejects.toThrow(/unknown theme "nope"/);
  });

  it('adds each fonts stylesheet once', () => {
    loadFonts('https://fonts.googleapis.com/css2?family=Chivo&display=swap');
    loadFonts('https://fonts.googleapis.com/css2?family=Chivo&display=swap');
    loadFonts(null);
    expect(links('link[data-nbc-fonts]')).toHaveLength(1);
  });
});
