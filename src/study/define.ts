import type { StudyThemeInput } from './types';

/**
 * Declares a study theme. An identity function: it exists for type checking
 * and to mark a theme file's default export. Validation lives in ./validate,
 * compilation in ./compile.
 */
export function defineTheme<const T extends StudyThemeInput>(theme: T): T {
  return theme;
}

export { flat, hardShadow, doubleStack } from './elevation';
