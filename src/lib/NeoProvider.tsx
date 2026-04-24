import { createContext, useContext } from 'react';
import type { ReactNode, JSX } from 'react';
import type { NeoTheme } from './themes';

const ThemeContext = createContext<NeoTheme | undefined>(undefined);

export type { NeoTheme };

export interface NeoProviderProps {
  theme: NeoTheme;
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function NeoProvider({
  theme,
  children,
  as = 'div',
  className,
}: NeoProviderProps) {
  const Tag = as as React.ElementType;
  return (
    <ThemeContext.Provider value={theme}>
      <Tag data-theme={theme} className={className}>
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): NeoTheme | undefined {
  return useContext(ThemeContext);
}
