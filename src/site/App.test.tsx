import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { replaceHash } from './router';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('scrolls to the top and sets the title once per page, not when the same page renders again', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    replaceHash('#/en/components/button');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Button' })).toBeInTheDocument();
    expect(document.title).toBe('button — neobrutalistcomponents');
    expect(scrollTo).toHaveBeenCalledTimes(1);

    // The same page again, with a query in its address: a new route object, the same page.
    document.title = 'unchanged';
    act(() => replaceHash('#/en/components/button?ref=llms'));
    expect(screen.getByRole('heading', { level: 1, name: 'Button' })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(document.title).toBe('unchanged');

    // Another page: its top, its title.
    act(() => replaceHash('#/en/components/card'));
    expect(screen.getByRole('heading', { level: 1, name: 'Card' })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(document.title).toBe('card — neobrutalistcomponents');
  });

  it('keeps the atlas where it is while its search changes the query', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    replaceHash('#/en/atlas');
    render(<App />);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    act(() => replaceHash('#/en/atlas?q=naka'));
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('naka');
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});
