import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { WorkCard } from './WorkCard';

const show = (id: string) =>
  render(
    <LangContext value="es">
      <WorkCard entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('WorkCard', () => {
  it('shows a work’s free photograph with its credit, its facts and its sources', async () => {
    show('xerox-star');
    expect(screen.getByRole('heading', { level: 2, name: 'Xerox Star' })).toBeInTheDocument();
    expect(screen.getByText('David Canfield Smith, Charles Irby, Ralph Kimball, Bill Verplank, Eric Harslem')).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: /Xerox Star 8010 en exhibición/ })).toBeInTheDocument();
    expect(screen.getByText(/Foto: vonguard/)).toBeInTheDocument();
    expect(screen.getByText('5 fuentes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Leer la ficha completa' })).toHaveAttribute('href', '#/es/theme/xerox-star');
  });

  it('shows a documentary plate when there is no free image, naming the palette’s origin', async () => {
    show('aqua');
    expect(await screen.findByText('Lámina documental: no hay una imagen libre de esta obra.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Colores del tema' }).querySelectorAll('li')).toHaveLength(ENTRIES.get('aqua')!.swatch.length);
    expect(screen.getByText(/^Paleta, /)).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('calls a house theme a house theme, with no image', () => {
    show('classic');
    expect(screen.getByText('Tema de la casa')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver el tema' })).toHaveAttribute('href', '#/es/theme/classic');
    expect(screen.queryByRole('figure')).toBeNull();
  });
});
