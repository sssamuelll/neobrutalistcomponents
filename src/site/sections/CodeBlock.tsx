import type { PropsWithChildren } from 'react';

export function CodeBlock({ children }: PropsWithChildren) {
  return <pre className="site-codeblock">{children}</pre>;
}
