import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SCENES } from '../../study/types';
import type { ThemeScene } from '../../study/types';
import { LangContext } from '../i18n';
import { CATALOG } from './data';
import { RoomLegend } from './RoomLegend';

function renderLegend(active: ThemeScene | null = null) {
  const onActive = vi.fn();
  render(
    <LangContext value="es">
      <RoomLegend active={active} onActive={onActive} />
    </LangContext>,
  );
  return onActive;
}

describe('the room legend', () => {
  it('lists every room, Origins last and without a place, with works that add up to the catalog', () => {
    renderLegend();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(SCENES.length);
    expect(rows.at(-1)).toHaveTextContent('Orígenes');
    expect(rows.at(-1)).toHaveTextContent('sin lugar');
    const works = rows.map((row) => Number(within(row).getAllByRole('cell')[0].textContent));
    expect(works.reduce((a, b) => a + b, 0)).toBe(CATALOG.length);
  });

  it('activates a room when its row is pointed at or its link focused, and clears it after', () => {
    const onActive = renderLegend();
    const link = screen.getByRole('link', { name: 'Japón' });
    fireEvent.pointerEnter(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith('japan');
    fireEvent.pointerLeave(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith(null);
    fireEvent.focus(link);
    expect(onActive).toHaveBeenLastCalledWith('japan');
    fireEvent.blur(link);
    expect(onActive).toHaveBeenLastCalledWith(null);
  });

  it('never activates Origins, which is not on the map', () => {
    const onActive = renderLegend();
    fireEvent.focus(screen.getByRole('link', { name: 'Orígenes' }));
    expect(onActive).not.toHaveBeenCalled();
  });

  it('marks the active room’s row', () => {
    renderLegend('italy');
    expect(screen.getByRole('link', { name: 'Italia' }).closest('tr')).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Japón' }).closest('tr')).not.toHaveAttribute('data-active');
  });
});
