import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NEO_THEMES, THEME_INFO } from 'neobrutalistcomponents';
import { CORE_FICHAS } from '../study/core-fichas';
import type { Lang } from '../study/types';
import { LangContext } from './i18n';
import { ThemeSwitcher } from './ThemeSwitcher';

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
