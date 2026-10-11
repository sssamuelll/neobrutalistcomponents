import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { CORE_FICHAS } from '../study/core-fichas';
import type { Lang } from '../study/types';
import { LangContext } from './i18n';
import { ModeSelect, ThemeSwitcher } from './ThemeSwitcher';

const show = (lang: Lang) =>
  render(
    <LangContext value={lang}>
      <ThemeSwitcher prefs={{ theme: 'classic', mode: 'native' }} onChange={() => undefined} />
    </LangContext>,
  );

describe('ThemeSwitcher', () => {
  it.each<Lang>(['es', 'en'])('titles every core theme with its tagline in the page’s language (%s)', (lang) => {
    show(lang);
    for (const id of NEO_THEMES) {
      const { name } = THEME_INFO[id];
      expect(screen.getByRole('button', { name }), id).toHaveAttribute('title', `${name} — ${CORE_FICHAS[id].tagline[lang]}`);
    }
  });

  it('reads Spanish in Spanish', () => {
    show('es');
    expect(screen.getByRole('button', { name: 'Classic' })).toHaveAttribute('title', 'Classic — Esta decisión es definitiva.');
  });
});

describe('ModeSelect', () => {
  it('reports the scheme the visitor picks', () => {
    const onChange = vi.fn();
    render(
      <LangContext value="es">
        <ModeSelect mode="native" onChange={onChange} />
      </LangContext>,
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Esquema de color' }), { target: { value: 'dark' } });
    expect(onChange).toHaveBeenCalledWith('dark');
  });
});
