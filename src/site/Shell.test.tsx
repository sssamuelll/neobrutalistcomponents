import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { replaceHash } from './router';

const observed = new Map<Element, IntersectionObserverCallback>();
class FakeObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(element: Element) {
    observed.set(element, this.callback);
  }
  disconnect() {
    for (const [element, callback] of observed) if (callback === this.callback) observed.delete(element);
  }
  unobserve() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  localStorage.clear();
  observed.clear();
  window.history.replaceState(null, '', '/');
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('the shell', () => {
  it('opens a menu sheet from the bar and closes it when a link is followed', () => {
    replaceHash('#/es/library');
    render(<App />);
    const button = screen.getByRole('button', { name: 'Menú' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    const sheet = screen.getByRole('dialog', { name: 'Menú' });
    expect(sheet).toHaveAttribute('open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const link = within(sheet).getByRole('link', { name: 'Archivo' });
    expect(link).toHaveAttribute('href', '#/es/atlas');
    fireEvent.click(link);
    expect(sheet).not.toHaveAttribute('open');
  });

  it('on the home, reveals its bar only once the monument’s sections have scrolled away', () => {
    replaceHash('#/es/');
    render(<App />);
    const bar = document.querySelector('.site-bar')!;
    expect(bar).toHaveClass('site-bar--home');
    expect(bar).not.toHaveAttribute('data-revealed');
    const nav = document.getElementById('monument-nav')!;
    act(() =>
      observed.get(nav)!([{ isIntersecting: false, target: nav, boundingClientRect: { top: -20 } } as unknown as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(bar).toHaveAttribute('data-revealed');
  });

  it('keeps the ordinary bar on other pages', () => {
    replaceHash('#/es/atlas');
    render(<App />);
    expect(document.querySelector('.site-bar')).not.toHaveClass('site-bar--home');
  });
});
