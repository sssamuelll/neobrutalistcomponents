import { createContext, use, useMemo } from 'react';
import type { ElementType, HTMLAttributes, Ref } from 'react';
import type { NeoMode, NeoTheme } from './themes';
import { cx } from './internal/cx';

export interface NeoContextValue {
  theme: NeoTheme;
  /** `undefined` means the theme renders in its native scheme. */
  mode: NeoMode | undefined;
}

const NeoContext = createContext<NeoContextValue | undefined>(undefined);

export interface NeoProviderProps extends HTMLAttributes<HTMLElement> {
  /** A built-in theme (`classic`, `tech`, `swiss`, `y2k`, `riso`) or the name of your own theme block. */
  theme: NeoTheme;
  /** Force `light` / `dark`, follow the OS with `system`, or omit for the theme's native scheme. */
  mode?: NeoMode;
  /** Element to render. Defaults to `div`. */
  as?: 'div' | 'main' | 'section' | 'article' | 'span';
  ref?: Ref<HTMLElement>;
}

/**
 * Scopes a theme to its subtree: renders `<div class="nbc-root" data-theme data-mode>`,
 * paints the theme's background, text color and font, and exposes `{ theme, mode }`
 * through `useTheme()`. Providers nest — an inner provider is a self-contained island.
 */
export function NeoProvider({ theme, mode, as = 'div', className, children, ...rest }: NeoProviderProps) {
  const Tag = as as ElementType;
  const value = useMemo(() => ({ theme, mode }), [theme, mode]);
  return (
    <NeoContext value={value}>
      <Tag {...rest} className={cx('nbc-root', className)} data-theme={theme} data-mode={mode}>
        {children}
      </Tag>
    </NeoContext>
  );
}

/** The nearest provider's `{ theme, mode }`, or `undefined` outside any provider. */
export function useTheme(): NeoContextValue | undefined {
  return use(NeoContext);
}
