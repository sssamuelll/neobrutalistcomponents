import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkCard } from './WorkCard';

vi.mock('../study/detail', async (original) => ({
  ...(await original<typeof import('../study/detail')>()),
  useThemeDetail: () => ({ status: 'error' }),
}));

describe('WorkCard when the ficha cannot load', () => {
  it('keeps what the catalog knows and the link to the work, without a broken image', () => {
    render(
      <LangContext value="es">
        <WorkCard entry={ENTRIES.get('xerox-star')!} />
      </LangContext>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Xerox Star' })).toBeInTheDocument();
    expect(screen.getByText('David Canfield Smith, Charles Irby, Ralph Kimball, Bill Verplank, Eric Harslem')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leer la ficha completa' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText(/fuentes$/)).toBeNull();
  });
});
