import { describe, expect, it } from 'vitest';
import { commonsApiUrl, fileTitleFromUrl, licenseFromCommons, plainText } from './commons';

describe('Commons helpers', () => {
  it.each([
    ['CC BY-SA 4.0', 'CC-BY-SA-4.0'],
    ['CC BY 2.0', 'CC-BY-2.0'],
    ['CC BY 1.0', 'CC-BY-1.0'],
    ['CC BY-SA 1.0', 'CC-BY-SA-1.0'],
    ['cc by-sa 3.0', 'CC-BY-SA-3.0'],
    ['CC0', 'CC0-1.0'],
    ['Public domain', 'PD'],
    ['CC BY-NC 2.0', null],
    ['CC BY-ND 4.0', null],
    ['Fair use', null],
    ['GFDL', null],
    ['', null],
  ])('maps the license "%s" to %s', (shortName, expected) => {
    expect(licenseFromCommons(shortName)).toBe(expected);
  });

  it('turns Commons HTML metadata into plain text', () => {
    expect(plainText('<a href="//commons.wikimedia.org/wiki/User:X">Jan&nbsp;Smit</a>  &amp; <i>Ana</i>')).toBe('Jan Smit & Ana');
  });

  it('extracts the file title from a Commons file page URL', () => {
    expect(fileTitleFromUrl('https://commons.wikimedia.org/wiki/File:Nakagin_Capsule_Tower_%282%29.jpg')).toBe(
      'File:Nakagin_Capsule_Tower_(2).jpg',
    );
    expect(() => fileTitleFromUrl('https://flickr.com/photos/x')).toThrow(/not a Commons file page URL/);
  });

  it('asks the API for metadata and a ≤1600px thumbnail', () => {
    const url = new URL(commonsApiUrl('File:Example.jpg'));
    expect(url.origin + url.pathname).toBe('https://commons.wikimedia.org/w/api.php');
    expect(url.searchParams.get('titles')).toBe('File:Example.jpg');
    expect(url.searchParams.get('iiprop')).toBe('url|size|extmetadata');
    expect(url.searchParams.get('iiurlwidth')).toBe('1600');
  });
});
