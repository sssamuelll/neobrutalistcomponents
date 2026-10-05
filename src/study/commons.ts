/** Pure helpers for scripts/fetch-image.mjs (Wikimedia Commons API). */
import type { ImageLicense } from './types';

/** Commons `LicenseShortName` → our license id; null when not allowed (NC, ND, fair use, GFDL-only, unknown). */
export function licenseFromCommons(shortName: string): ImageLicense | null {
  const s = shortName.trim().toLowerCase().replace(/\s+/g, ' ');
  if (s === 'cc0' || s === 'cc0 1.0' || s === 'cc-zero') return 'CC0-1.0';
  if (s === 'public domain' || s === 'pd') return 'PD';
  const m = s.match(/^cc by(-sa)? (2\.0|2\.5|3\.0|4\.0)$/);
  return m ? (`CC-BY${m[1] ? '-SA' : ''}-${m[2]}` as ImageLicense) : null;
}

/** Plain text from Commons HTML metadata: tags stripped, entities decoded, whitespace collapsed. */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** API URL returning the file's metadata and a thumbnail at most `width` px wide. */
export function commonsApiUrl(fileTitle: string, width = 1600): string {
  const params = new URLSearchParams({
    action: 'query',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: String(width),
    format: 'json',
    formatversion: '2',
    origin: '*',
  });
  return `https://commons.wikimedia.org/w/api.php?${params}`;
}

/** 'https://commons.wikimedia.org/wiki/File:Foo_%282%29.jpg' → 'File:Foo_(2).jpg' */
export function fileTitleFromUrl(url: string): string {
  const m = url.match(/^https:\/\/commons\.wikimedia\.org\/wiki\/(File:[^?#]+)$/);
  if (!m) throw new Error(`not a Commons file page URL: ${url}`);
  return decodeURIComponent(m[1]);
}
