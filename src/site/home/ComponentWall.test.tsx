import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SLUGS } from '../../docs/slugs';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { ComponentWall } from './ComponentWall';

const show = (id: string) =>
  render(
    <LangContext value="es">
      <ComponentWall entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

describe('ComponentWall', () => {
  it('names the work it is painted in, or the house theme', () => {
    show('aqua');
    expect(screen.getByRole('heading', { level: 2, name: 'Los mismos componentes, en el idioma de Mac OS X Aqua' })).toBeInTheDocument();
  });

  it('says «en el tema» for a house theme', () => {
    show('classic');
    expect(screen.getByRole('heading', { level: 2, name: 'Los mismos componentes, en el tema Classic' })).toBeInTheDocument();
  });

  it('shows all sixteen components, each block linking to their pages', () => {
    const { container } = show('aqua');
    const missing = SLUGS.filter((slug) => !container.querySelector(`a[href="#/es/components/${slug}"]`));
    expect(missing).toEqual([]);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Secciones de los ajustes' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sala' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Recorrido guiado' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('opens a real dialog that holds the theme’s install lines', () => {
    show('aqua');
    fireEvent.click(screen.getByRole('button', { name: 'Colgar' }));
    const dialog = screen.getByRole('dialog', { name: 'Colgar Mac OS X Aqua' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveTextContent("import 'neobrutalistcomponents/themes/aqua.css';");
  });

  it('lists the room around the active work and marks it', () => {
    show('win95');
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(5);
    expect(within(rows[2]).getByText('aquí')).toBeInTheDocument();
    expect(rows[2]).toHaveTextContent('Windows 95');
  });
});
