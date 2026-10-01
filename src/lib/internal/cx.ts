/** Joins truthy class names with a single space. */
export function cx(...parts: Array<string | false | null | undefined | 0>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Turns any string (React `useId()` output, user-supplied values) into a
 * token that is valid both as an HTML id/IDREF and inside a CSS dashed-ident.
 */
export function toSafeId(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '_');
}
