import { describe, it, expect } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { FieldShell } from './Field';
import { useField } from './useField';

describe('useField', () => {
  it('generates a safe id when none is given', () => {
    const { result } = renderHook(() => useField(undefined, {}));
    expect(result.current.id).toMatch(/^nbc-[A-Za-z0-9_-]+$/);
  });

  it('keeps a provided id', () => {
    const { result } = renderHook(() => useField('email', {}));
    expect(result.current.id).toBe('email');
  });

  it('description only: not invalid, message is the description', () => {
    const { result } = renderHook(() => useField('f', { description: 'hint' }));
    expect(result.current).toMatchObject({ invalid: false, message: 'hint', messageId: 'f-message', isError: false });
  });

  it('error message replaces the description', () => {
    const { result } = renderHook(() => useField('f', { description: 'hint', error: 'bad' }));
    expect(result.current).toMatchObject({ invalid: true, message: 'bad', isError: true });
  });

  it('error=true marks invalid but keeps the description', () => {
    const { result } = renderHook(() => useField('f', { description: 'hint', error: true }));
    expect(result.current).toMatchObject({ invalid: true, message: 'hint', isError: false });
  });

  it.each([false, '', null, undefined])('error=%s is not invalid', (error) => {
    const { result } = renderHook(() => useField('f', { error }));
    expect(result.current.invalid).toBe(false);
    expect(result.current.messageId).toBeUndefined();
  });
});

describe('FieldShell', () => {
  it('renders label, control slot and message with the right hooks', () => {
    render(
      <FieldShell id="f" label="Email" required message="bad" messageId="f-message" isError invalid size="lg" className="mine">
        <input id="f" />
      </FieldShell>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('id', 'f');
    const wrapper = input.closest('.nbc-field');
    expect(wrapper).toHaveClass('nbc-field--lg', 'nbc-field--invalid', 'mine');
    const marker = wrapper!.querySelector('.nbc-field__required');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('bad')).toHaveAttribute('id', 'f-message');
    expect(screen.getByText('bad')).toHaveClass('nbc-field__message', 'nbc-field__message--error');
  });

  it('omits label and message when absent', () => {
    const { container } = render(
      <FieldShell id="f" isError={false} invalid={false} size="md">
        <input id="f" aria-label="x" />
      </FieldShell>,
    );
    expect(container.querySelector('label')).toBeNull();
    expect(container.querySelector('.nbc-field__message')).toBeNull();
  });
});
