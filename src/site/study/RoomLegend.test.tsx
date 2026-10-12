import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ThemeScene } from '../../study/types';
import { LangContext } from '../i18n';
import { CATALOG } from './data';
import { RoomLegend } from './RoomLegend';
import { OPEN_SCENES } from './rooms';

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
  it('lists every open room, the house last and without a place, with works that add up to the catalog', () => {
    renderLegend();
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(OPEN_SCENES.length);
    expect(rows.at(-1)).toHaveTextContent('La casa');
    expect(rows.at(-1)).toHaveTextContent('sin lugar');
    const works = rows.map((row) => Number(within(row).getAllByRole('cell')[0].textContent));
    expect(works.reduce((a, b) => a + b, 0)).toBe(CATALOG.length);
  });

  it('activates a room when its row is pointed at or its link focused, and clears it after', () => {
    const onActive = renderLegend();
    const link = screen.getByRole('link', { name: 'Estados Unidos' });
    fireEvent.pointerEnter(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith('usa');
    fireEvent.pointerLeave(link.closest('tr')!);
    expect(onActive).toHaveBeenLastCalledWith(null);
    fireEvent.focus(link);
    expect(onActive).toHaveBeenLastCalledWith('usa');
    fireEvent.blur(link);
    expect(onActive).toHaveBeenLastCalledWith(null);
  });

  it('never activates the house, which is not on the map', () => {
    const onActive = renderLegend();
    fireEvent.focus(screen.getByRole('link', { name: 'La casa' }));
    expect(onActive).not.toHaveBeenCalled();
  });

  it('marks the active room’s row', () => {
    renderLegend('usa');
    expect(screen.getByRole('link', { name: 'Estados Unidos' }).closest('tr')).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'La casa' }).closest('tr')).not.toHaveAttribute('data-active');
  });
});
