import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { useLang, useT } from '../i18n';
import { CATALOG } from '../study/data';
import { loadFontSubset } from '../study/loader';
import { Island } from '../study/ThemeCard';
import { TOUCH_RESUME_MS, isHeld, nextScroll } from './drift';
import type { DriftHold } from './drift';
import { chipLabel, ribbonOrder } from './works';

/** Advances the track's scroll on every frame unless something holds it (see isHeld). */
function useDrift(trackRef: RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof requestAnimationFrame !== 'function') return;
    const reducedQuery = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const hold: DriftHold = { hover: false, focus: false, touchUntil: 0, hidden: document.hidden, reduced: reducedQuery?.matches ?? false };
    let position = track.scrollLeft;
    let last = performance.now();
    let frame = 0;
    // ponytail: the loop width is read every frame (one cheap layout read); cache it on resize if profiling ever shows it.
    const loopWidth = () => {
      const first = track.firstElementChild as HTMLElement | null;
      const second = track.querySelector<HTMLElement>('[data-loop-start]');
      return first && second ? second.offsetLeft - first.offsetLeft : 0;
    };
    const tick = (now: number) => {
      if (isHeld(hold, now)) position = track.scrollLeft;
      else {
        position = nextScroll(position, now - last, loopWidth());
        track.scrollLeft = position;
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const enter = () => (hold.hover = true);
    const leave = () => (hold.hover = false);
    // Only keyboard focus holds the drift: a click or a tap also focuses the chip, and must not stop it for good.
    const focusIn = (event: FocusEvent) => (hold.focus = (event.target as Element).matches(':focus-visible'));
    const focusOut = (event: FocusEvent) => (hold.focus = track.contains(event.relatedTarget as Node | null));
    const touchStart = () => (hold.touchUntil = Infinity);
    const touchEnd = () => (hold.touchUntil = performance.now() + TOUCH_RESUME_MS);
    const visibility = () => (hold.hidden = document.hidden);
    const motion = (event: MediaQueryListEvent) => (hold.reduced = event.matches);
    track.addEventListener('pointerenter', enter);
    track.addEventListener('pointerleave', leave);
    track.addEventListener('focusin', focusIn);
    track.addEventListener('focusout', focusOut);
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchcancel', touchEnd);
    document.addEventListener('visibilitychange', visibility);
    reducedQuery?.addEventListener('change', motion);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('pointerenter', enter);
      track.removeEventListener('pointerleave', leave);
      track.removeEventListener('focusin', focusIn);
      track.removeEventListener('focusout', focusOut);
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('touchend', touchEnd);
      track.removeEventListener('touchcancel', touchEnd);
      document.removeEventListener('visibilitychange', visibility);
      reducedQuery?.removeEventListener('change', motion);
    };
  }, [trackRef]);
}

/**
 * Every theme as a chip painted in its own tokens, drifting left. The list is rendered twice so the
 * loop never shows a seam; the copy is hidden from assistive technology and from the tab order.
 */
export function ThemeRibbon({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  const lang = useLang();
  const t = useT();
  const track = useRef<HTMLUListElement>(null);
  const entries = useMemo(() => ribbonOrder(CATALOG), []);
  useDrift(track);

  useEffect(() => {
    for (const entry of entries) if (!entry.predatesStudy) loadFontSubset(entry.fontsHref, entry.name[lang]);
  }, [entries, lang]);

  const chips = (copy: boolean) =>
    entries.map((entry, i) => (
      <li key={`${copy ? 'b' : 'a'}-${entry.id}`} className="ribbon__item" aria-hidden={copy ? true : undefined} data-loop-start={copy && i === 0 ? '' : undefined}>
        <Island entry={entry} className="ribbon__island" withFonts={false}>
          <button
            type="button"
            className="ribbon__chip"
            aria-pressed={entry.id === active}
            aria-label={chipLabel(entry, lang, t('useTheme'))}
            tabIndex={copy ? -1 : undefined}
            onClick={() => onPick(entry.id)}
          >
            {entry.name[lang]}
          </button>
        </Island>
      </li>
    ));

  return (
    <div className="ribbon" role="group" aria-label={t('ribbonLabel')}>
      <ul ref={track} className="ribbon__track">
        {chips(false)}
        {chips(true)}
      </ul>
    </div>
  );
}
