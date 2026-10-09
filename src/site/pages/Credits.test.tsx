import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../App';
import { replaceHash } from '../router';

// A typeface whose licence went unrecorded. fonts.test.ts stops that in CI;
// should one slip through, it must not take the site down with it.
vi.mock('../../study/fonts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../study/fonts')>();
  return { ...actual, fontLicense: (family: string) => (family === 'Geist Mono' ? undefined : actual.fontLicense(family)) };
});

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

describe('a typeface without a recorded licence', () => {
  it('does not stop the site from booting: other pages render', () => {
    replaceHash('#/en/library');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Components that hold their shape.' })).toBeInTheDocument();
  });

  it('fails only the typefaces table, inside the Credits page and its shell', () => {
    replaceHash('#/es/credits');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Créditos' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Fotografías' })).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Tipografías' })).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('No se pueden listar las tipografías');
  });
});
