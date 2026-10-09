import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { replaceHash } from '../router';
import { CATALOG } from '../study/data';

// A stand-in IntersectionObserver that reports nothing until the test says so.
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

const themeLinks = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-nbc-theme]')].map((link) => link.dataset.nbcTheme);

beforeEach(() => {
  observed.clear();
  vi.stubGlobal('IntersectionObserver', FakeObserver);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  replaceHash('#/es/');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the gallery home', () => {
  it('loads a work’s theme only when the work nears the viewport', () => {
    render(<App />);
    const works = document.querySelectorAll('.gallery-work');
    expect(works).toHaveLength(CATALOG.length);
    expect(themeLinks()).toEqual([]);

    const work = screen.getByRole('article', { name: 'Nakagin' });
    act(() => observed.get(work)!([{ isIntersecting: true, target: work } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(themeLinks()).toEqual(['nakagin']);
  });
});
