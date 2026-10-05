/** Color helpers for the study compiler and families. */
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Lowercased #hex; throws on anything the token contract can't resolve. */
export function normalizeHex(color: string): string {
  if (!HEX.test(color)) throw new Error(`not a #hex color: ${color}`);
  return color.toLowerCase();
}

/** `light-dark(light, dark)`, or the single color when both schemes match. */
export function lightDark(light: string, dark: string): string {
  return light === dark ? light : `light-dark(${light}, ${dark})`;
}

/** #rgb, #rgba, #rrggbb or #rrggbbaa → #rrggbb plus the given alpha byte. */
export function withAlpha(color: string, alpha: number): string {
  if (!(alpha >= 0 && alpha <= 1)) throw new Error(`alpha must be within 0..1, got ${alpha}`);
  let h = normalizeHex(color).slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  return `#${h.slice(0, 6)}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
}
