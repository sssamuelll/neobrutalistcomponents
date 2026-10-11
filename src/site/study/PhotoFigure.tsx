import type { ImageCredit } from '../../study/types';
import { useLang, useT } from '../i18n';
import { imageUrl } from './detail';
import { LICENSE_URLS, licenseName } from './format';

/** A work's free photograph with its credit: author, licence and Commons page. Nothing when the file is not in the build. */
export function PhotoFigure({ image, className }: { image: ImageCredit; className?: string }) {
  const lang = useLang();
  const t = useT();
  const url = imageUrl(image.file);
  if (!url) return null;
  return (
    <figure className={className}>
      <img src={url} alt={image.alt[lang]} width={image.width} height={image.height} loading="lazy" decoding="async" />
      <figcaption>
        {t('photoBy')} {image.author},{' '}
        <a href={LICENSE_URLS[image.license]} target="_blank" rel="noreferrer">
          {licenseName(image.license, lang)}
        </a>
        , {t('via')}{' '}
        <a href={image.sourceUrl} target="_blank" rel="noreferrer">
          Wikimedia Commons
        </a>
        ; {t('converted')}.
      </figcaption>
    </figure>
  );
}
