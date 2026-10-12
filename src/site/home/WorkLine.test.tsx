import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Lang } from '../../study/types';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkLine } from './WorkLine';

const show = (id: string, lang: Lang) =>
  render(
    <LangContext value={lang}>
      <WorkLine entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('WorkLine', () => {
  it('names the work, two authors and the team, its years, and links to it', () => {
    show('xerox-star', 'es');
    const line = document.querySelector('.monument__work');
    expect(line).toHaveTextContent('Xerox Star · David Canfield Smith, Charles Irby y equipo · 1981 · Ver la obra →');
    expect(line).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('link', { name: 'Ver la obra' })).toHaveAttribute('href', '#/es/theme/xerox-star');
  });

  it('calls a house theme what it is', () => {
    show('classic', 'en');
    expect(document.querySelector('.monument__work')).toHaveTextContent('Classic · House theme · See the theme →');
    expect(screen.getByRole('link', { name: 'See the theme' })).toHaveAttribute('href', '#/en/theme/classic');
  });
});
