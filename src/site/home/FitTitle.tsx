import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { fitSizes } from './fit';
import type { TitleLine } from './fit';

/**
 * The page's h1 as poster lines. Each line is measured at 100 px and set to fill the title's width,
 * again on resize and whenever fonts finish loading. Letters are spans so they can cascade in;
 * screen readers get the plain label instead.
 */
export function FitTitle({ lines, label, className }: { lines: readonly TitleLine[]; label: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = ref.current;
    if (!title) return;
    const fit = () => {
      const spans = [...title.querySelectorAll<HTMLElement>('.fit-title__line')];
      for (const span of spans) span.style.fontSize = '100px';
      const widths = spans.map((span) => span.getBoundingClientRect().width);
      const sizes = fitSizes(widths, spans.map((span) => span.dataset.fit === 'true'), title.clientWidth);
      spans.forEach((span, i) => {
        span.style.fontSize = sizes[i] > 0 ? `${sizes[i]}px` : '';
      });
    };
    fit();
    // A window resize, not a ResizeObserver on the title: fitting changes the title's height, and
    // observing it would report a loop.
    window.addEventListener('resize', fit);
    const fonts = typeof document.fonts === 'undefined' ? null : document.fonts;
    fonts?.addEventListener('loadingdone', fit);
    void fonts?.ready.then(fit);
    return () => {
      window.removeEventListener('resize', fit);
      fonts?.removeEventListener('loadingdone', fit);
    };
  }, [lines]);

  const starts = lines.map((_, i) => lines.slice(0, i).reduce((count, line) => count + [...line.text].length, 0));

  return (
    <h1 ref={ref} className={className ? `fit-title ${className}` : 'fit-title'}>
      <span className="site-visually-hidden">{label}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <span key={line.text} className={line.fit ? 'fit-title__line' : 'fit-title__line fit-title__line--joint'} data-fit={String(line.fit)}>
            {[...line.text].map((char, j) => (
              <span key={j} className="fit-title__char" style={{ '--i': starts[i] + j } as CSSProperties}>
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
