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
        <WorkCard entry={ENTRIES.get('nakagin')!} />
      </LangContext>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Nakagin' })).toBeInTheDocument();
    expect(screen.getByText('Kisho Kurokawa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leer la ficha completa' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText(/fuentes$/)).toBeNull();
  });
});
