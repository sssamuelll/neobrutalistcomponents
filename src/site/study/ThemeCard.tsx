import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { Badge, Card, NeoProvider } from 'neobrutalistcomponents';
import type { CatalogEntry } from '../../study/catalog';
import { SCENE_TEXT, useLang, useT } from '../i18n';
import { useSitePrefsContext } from '../prefsContext';
import { toHash } from '../router';
import { years } from './format';
import { loadFonts } from './loader';

/** Loads a study theme's fonts once its island comes near the viewport. */
function useFontsNearViewport(ref: RefObject<HTMLElement | null>, entry: CatalogEntry) {
  const href = entry.predatesStudy ? null : entry.fontsHref;
  useEffect(() => {
    const element = ref.current;
    if (!href || !element) return;
    if (typeof IntersectionObserver === 'undefined') {
      loadFonts(href);
      return;
    }
    const observer = new IntersectionObserver(
      (records) => {
        if (records.some((record) => record.isIntersecting)) {
          loadFonts(href);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, href]);
}

/**
 * A theme's own island: study themes paint with their catalog tokens set
 * inline, so no stylesheet is fetched; core themes are always loaded.
 */
function Island({ entry, className, children }: { entry: CatalogEntry; className: string; children: ReactNode }) {
  const { prefs } = useSitePrefsContext();
  const ref = useRef<HTMLElement>(null);
  useFontsNearViewport(ref, entry);
  return (
    <NeoProvider
      ref={ref}
      theme={entry.id}
      mode={prefs.mode === 'native' ? undefined : prefs.mode}
      className={className}
      style={(entry.vars ?? undefined) as CSSProperties | undefined}
    >
      {children}
    </NeoProvider>
  );
}

/**
 * One theme as an atlas card; `as="div"` where the card is not a list item.
 * `heading` is the name's level in the page outline: h2 right under the page's
 * h1 (the atlas), h3 under a section's h2 (a scene's timeline).
 */
export function ThemeCard({ entry, as: Wrapper = 'li', heading = 'h3' }: { entry: CatalogEntry; as?: 'li' | 'div'; heading?: 'h2' | 'h3' }) {
  const lang = useLang();
  const t = useT();
  return (
    <Wrapper className="site-cards__item">
      <Island entry={entry} className="site-card-island">
        <Card variant="interactive" as="article" className="site-card">
          <Card.Header>
            <Card.Title as={heading}>
              <a href={toHash(lang, `/theme/${entry.id}`)}>{entry.name[lang]}</a>
            </Card.Title>
            <Card.Description>
              {entry.reference.title[lang]}, {years(entry.reference.date)}
            </Card.Description>
          </Card.Header>
          <Card.Content className="site-card__body">
            <span className="site-card__swatches" aria-hidden="true">
              {entry.swatch.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </span>
            <span className="nbc-button nbc-button--primary nbc-button--sm" aria-hidden="true">
              <span className="nbc-button__label">Aa</span>
            </span>
          </Card.Content>
          <Card.Footer className="site-card__foot">
            <span>{SCENE_TEXT[entry.scene].name[lang]}</span>
            {entry.predatesStudy ? <Badge variant="neutral">{t('fromLibrary')}</Badge> : null}
          </Card.Footer>
        </Card>
      </Island>
    </Wrapper>
  );
}

/** One theme as a small tile: its name in its own display type, on its own ground. */
export function ThemeTile({ entry }: { entry: CatalogEntry }) {
  const lang = useLang();
  return (
    <li className="study-mosaic__item">
      <Island entry={entry} className="study-tile">
        <a className="study-tile__link" href={toHash(lang, `/theme/${entry.id}`)}>
          <span className="study-tile__name">{entry.name[lang]}</span>
          <span className="study-tile__swatches" aria-hidden="true">
            {entry.swatch.slice(0, 3).map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </span>
        </a>
      </Island>
    </li>
  );
}
