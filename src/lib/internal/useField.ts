import { useId } from 'react';
import type { ReactNode } from 'react';
import { isPresent, toSafeId } from './cx';
import type { FieldOwnProps } from './Field';

/**
 * Resolves the id, validity and message of a form control from the shared
 * Field API: an `error` message replaces the description; `error={true}`
 * marks the control invalid and keeps the description.
 */
export function useField(idProp: string | undefined, { description, error }: Omit<FieldOwnProps, 'label'>) {
  const autoId = useId();
  const id = idProp ?? `nbc-${toSafeId(autoId)}`;
  const invalid = isPresent(error);
  const isError = invalid && error !== true;
  const message: ReactNode = isError ? (error as ReactNode) : description;
  const hasMessage = isPresent(message);
  return {
    id,
    invalid,
    isError,
    message: hasMessage ? message : undefined,
    messageId: hasMessage ? `${id}-message` : undefined,
  };
}
