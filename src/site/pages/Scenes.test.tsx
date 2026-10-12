import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LangContext } from '../i18n';
import { OPEN_THEME_SCENES } from '../study/rooms';
import { Scenes } from './Scenes';

function renderPage() {
  render(
    <LangContext value="es">
      <Scenes />
    </LangContext>,
  );
}
const figure = () => document.querySelector('figure.world-map')!;
const region = (scene: string) => document.querySelector(`.world-map__room[data-scene="${scene}"]`)!;

describe('the rooms page', () => {
  it('draws one region per room with a place, each a link to its room, out of the tab order and hidden from assistive technology', () => {
    renderPage();
    expect(document.querySelector('.world-map__svg')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelectorAll('.world-map__room')).toHaveLength(OPEN_THEME_SCENES.length);
    expect(region('japan')).toBeNull();
    for (const scene of OPEN_THEME_SCENES) {
      expect(region(scene)).toHaveAttribute('href', `#/es/scene/${scene}`);
      expect(region(scene)).toHaveAttribute('tabindex', '-1');
    }
  });

  it('pointing at a region highlights it and its legend row; leaving clears both', () => {
    renderPage();
    fireEvent.pointerEnter(region('usa'));
    expect(figure()).toHaveAttribute('data-active', 'usa');
    expect(region('usa')).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('link', { name: 'Estados Unidos' }).closest('tr')).toHaveAttribute('data-active', 'true');
    fireEvent.pointerLeave(region('usa'));
    expect(figure()).not.toHaveAttribute('data-active');
    expect(region('usa')).not.toHaveAttribute('data-active');
  });

  it('focusing a room in the legend highlights its region only', () => {
    renderPage();
    fireEvent.focus(screen.getByRole('link', { name: 'Estados Unidos' }));
    expect(region('usa')).toHaveAttribute('data-active', 'true');
    expect(document.querySelectorAll('.world-map__room[data-active]')).toHaveLength(1);
  });
});
