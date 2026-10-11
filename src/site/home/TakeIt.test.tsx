import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LangContext } from '../i18n';
import { ENTRIES } from '../study/data';
import { TakeIt } from './TakeIt';

const setClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
const show = (id: string) =>
  render(
    <LangContext value="es">
      <TakeIt entry={ENTRIES.get(id)!} />
    </LangContext>,
  );

afterEach(() => {
  setClipboard(undefined);
});

describe('TakeIt', () => {
  it('gives the install command and the theme’s import lines', () => {
    show('nakagin');
    expect(screen.getByRole('heading', { level: 2, name: 'Llévatelo' })).toBeInTheDocument();
    // The code is split into highlighted tokens, so read the section's whole text.
    const section = screen.getByRole('region', { name: 'Llévatelo' });
    expect(section).toHaveTextContent('npm install neobrutalistcomponents');
    expect(section).toHaveTextContent("import 'neobrutalistcomponents/themes/nakagin.css';");
    expect(screen.getByRole('link', { name: 'Guía para agentes' })).toHaveAttribute('href', '#/es/agents');
  });

  it('copies the theme’s tokens as one CSS rule', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    show('nakagin');
    fireEvent.click(screen.getByRole('button', { name: 'Copiar CSS' }));
    expect(await screen.findByRole('button', { name: 'CSS copiado' })).toBeInTheDocument();
    const css = writeText.mock.calls[0][0] as string;
    expect(css.startsWith("[data-theme='nakagin'] {\n")).toBe(true);
    expect(css).toMatch(/^ {2}--nbc-bg: /m);
  });

  it('says so when the CSS cannot be copied', async () => {
    setClipboard(undefined);
    show('classic');
    fireEvent.click(screen.getByRole('button', { name: 'Copiar CSS' }));
    expect(await screen.findByRole('button', { name: 'No se pudo copiar el CSS' })).toBeInTheDocument();
  });
});
