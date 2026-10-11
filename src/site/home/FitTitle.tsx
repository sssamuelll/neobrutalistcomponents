import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { capSizes, fitSizes } from './fit';
import type { TitleLine } from './fit';

interface FitTitleProps {
  lines: readonly TitleLine[];
  label: string;
  className?: string;
  /** The tallest the title may be, in px; when fitting the width would make it taller, every line shrinks by one factor. */
  maxHeight?: (title: HTMLElement) => number;
}

/**
 * The page's h1 as poster lines. Each line is measured at 100 px and set to fill the title's width,
 * again on resize and whenever fonts finish loading. Letters are spans so they can cascade in;
 * screen readers get the plain label instead.
 */
export function FitTitle({ lines, label, className, maxHeight }: FitTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = ref.current;
    if (!title) return;
    const fit = () => {
      const spans = [...title.querySelectorAll<HTMLElement>('.fit-title__line')];
      const fits = spans.map((span) => span.dataset.fit === 'true');
      const apply = (sizes: readonly number[]) =>
        spans.forEach((span, i) => {
          span.style.fontSize = sizes[i] > 0 ? `${sizes[i]}px` : '';
        });
      for (const span of spans) span.style.fontSize = '100px';
      let sizes = fitSizes(spans.map((span) => span.getBoundingClientRect().width), fits, title.clientWidth);
      apply(sizes);
      // Optical sizes make a line's width not quite proportional to its size: correct once from the real widths.
      const at100 = spans.map((span, i) => (sizes[i] > 0 ? (span.getBoundingClientRect().width * 100) / sizes[i] : 0));
      sizes = fitSizes(at100, fits, title.clientWidth);
      apply(sizes);
      const room = maxHeight ? maxHeight(title) : Number.NaN;
      const capped = capSizes(sizes, title.getBoundingClientRect().height, room);
      apply(capped);
      title.toggleAttribute('data-capped', capped.some((size, i) => size < sizes[i]));
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
  }, [lines, maxHeight]);

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
