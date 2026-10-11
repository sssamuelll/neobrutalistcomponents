import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { replaceHash } from '../router';
import { CATALOG } from '../study/data';

const themeLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-theme]')];
const matchMedia = (media: string) => ({ matches: false, media, addEventListener() {}, removeEventListener() {} });

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('matchMedia', matchMedia);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  replaceHash('#/es/');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const link of document.head.querySelectorAll('link')) link.remove();
});

describe('the home', () => {
  it('names the gallery in its only h1 and arrives without fetching a study stylesheet', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Galería de las Interfaces' })).toBeInTheDocument();
    expect(themeLinks()).toEqual([]);
  });

  it('lists every theme once, the active one pressed, and the gallery’s sections', () => {
    render(<App />);
    expect(within(screen.getByRole('group', { name: 'Temas' })).getAllByRole('button')).toHaveLength(CATALOG.length);
    expect(screen.getByRole('button', { name: 'Classic: usar este tema' })).toHaveAttribute('aria-pressed', 'true');
    const sections = screen.getByRole('navigation', { name: 'Secciones de la galería' });
    expect(within(sections).getByRole('link', { name: 'Archivo' })).toHaveAttribute('href', '#/es/atlas');
  });

  it('a chip loads its theme first, then repaints the site and names the new work', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Nakagin, 1970–1972: usar este tema' }));
    const link = document.head.querySelector('link[data-nbc-theme="nakagin"]');
    expect(link).not.toBeNull();
    expect(document.documentElement.dataset.theme).toBe('classic');
    act(() => {
      link!.dispatchEvent(new Event('load'));
    });
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('nakagin'));
    expect(document.querySelector('.monument__work')).toHaveTextContent('Nakagin · Kisho Kurokawa · 1970–1972 · Ver la obra');
  });

  it('when two chips are pressed, the last one wins even if the first one loads later', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'SESC Pompéia, 1977–1986: usar este tema' }));
    fireEvent.click(screen.getByRole('button', { name: 'BeOS, 2000: usar este tema' }));
    const slow = document.head.querySelector('link[data-nbc-theme="sesc-pompeia"]')!;
    const fast = document.head.querySelector('link[data-nbc-theme="beos"]')!;
    act(() => {
      fast.dispatchEvent(new Event('load'));
    });
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('beos'));
    await act(async () => {
      slow.dispatchEvent(new Event('load'));
    });
    expect(document.documentElement.dataset.theme).toBe('beos');
  });

  it('a chip whose stylesheet cannot load leaves the site in its theme, without an unhandled error', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Mäusebunker, 1971–1982: usar este tema' }));
    const link = document.head.querySelector('link[data-nbc-theme="maeusebunker"]');
    await act(async () => {
      link!.dispatchEvent(new Event('error'));
    });
    expect(document.documentElement.dataset.theme).toBe('classic');
  });
});
