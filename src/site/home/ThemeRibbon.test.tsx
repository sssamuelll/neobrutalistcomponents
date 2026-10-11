import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { SitePrefsContext } from '../prefsContext';
import { CATALOG } from '../study/data';
import { ThemeRibbon } from './ThemeRibbon';

const ctx = { prefs: { theme: 'dragon-quest', mode: 'native' as const }, update: () => undefined };
const show = (onPick = vi.fn()) =>
  render(
    <LangContext value="es">
      <SitePrefsContext value={ctx}>
        <ThemeRibbon active="dragon-quest" onPick={onPick} />
      </SitePrefsContext>
    </LangContext>,
  );

describe('ThemeRibbon', () => {
  it('offers every theme once to assistive technology, the active one pressed', () => {
    show();
    const group = screen.getByRole('group', { name: 'Temas' });
    expect(within(group).getAllByRole('button')).toHaveLength(CATALOG.length);
    expect(screen.getByRole('button', { name: 'Dragon Quest, 1986: usar este tema' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Classic: usar este tema' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('picks the theme of the chip pressed', () => {
    const onPick = vi.fn();
    show(onPick);
    fireEvent.click(screen.getByRole('button', { name: 'Nakagin, 1970–1972: usar este tema' }));
    expect(onPick).toHaveBeenCalledWith('nakagin');
  });

  it('repeats the list for the loop, hidden and out of the tab order', () => {
    show();
    const copies = document.querySelectorAll<HTMLButtonElement>('[aria-hidden="true"] button');
    expect(copies).toHaveLength(CATALOG.length);
    expect([...copies].every((button) => button.tabIndex === -1)).toBe(true);
  });

  it('loads each work’s fonts as a subset of its name', () => {
    show();
    const subsets = [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-fonts]')].map((link) => link.href);
    expect(subsets.length).toBeGreaterThan(0);
    expect(subsets.every((href) => href.includes('text='))).toBe(true);
  });
});
