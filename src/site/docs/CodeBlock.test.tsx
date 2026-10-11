import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

const setClipboard = (value: unknown) => Object.defineProperty(navigator, 'clipboard', { value, configurable: true });

afterEach(() => {
  setClipboard(undefined);
});

describe('CodeBlock', () => {
  it('copies the code and says so in the labels it was given', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<CodeBlock code="npm install x" label="Shell" copyLabel="Copiar Shell" copiedLabel="Copiado" selectLabel="Selecciona y copia" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copiar Shell' }));
    expect(await screen.findByRole('button', { name: 'Copiado' })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith('npm install x');
  });

  it('selects its own text and asks to copy by hand when the clipboard is unavailable', async () => {
    setClipboard(undefined);
    render(<CodeBlock code="npm install x" label="Shell" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy shell' }));
    expect(await screen.findByRole('button', { name: 'Select and copy' })).toHaveTextContent('Select and copy');
    expect(window.getSelection()?.toString()).toBe('npm install x');
  });
});
