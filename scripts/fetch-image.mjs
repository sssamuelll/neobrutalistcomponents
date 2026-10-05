// Downloads a Wikimedia Commons photo for a study ficha. Author and license
// come from the Commons API — never typed by hand. Converts to AVIF, at most
// 1600 px wide and 250 000 bytes, into src/study/images/<name>.avif, and
// prints the `image: { … }` block to paste into the ficha.
//
//   npm run fetch:image -- https://commons.wikimedia.org/wiki/File:Example.jpg nakagin
import { runnerImport } from 'vite';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/study/images');
const BUDGET = 250_000;
const HEADERS = { 'User-Agent': 'neobrutalistcomponents-study/1.0 (https://github.com/sssamuelll/neobrutalistcomponents)' };

const fail = (message) => {
  console.error(`fetch-image: ${message}`);
  process.exit(1);
};

const [pageUrl, name] = process.argv.slice(2);
if (!pageUrl || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name ?? '')) {
  fail('usage: npm run fetch:image -- <commons file page URL> <kebab-case-name>');
}

const { commonsApiUrl, fileTitleFromUrl, licenseFromCommons, plainText } = (
  await runnerImport(join(ROOT, 'src/study/commons.ts'), { configFile: false, logLevel: 'silent' })
).module;

const title = fileTitleFromUrl(pageUrl);
const response = await fetch(commonsApiUrl(title), { headers: HEADERS });
if (!response.ok) fail(`Commons API answered ${response.status}`);
const info = (await response.json()).query?.pages?.[0]?.imageinfo?.[0];
if (!info) fail(`no image info for ${title}`);

const meta = info.extmetadata ?? {};
const shortName = meta.LicenseShortName?.value ?? '';
const license = licenseFromCommons(shortName);
if (!license) fail(`license "${shortName}" is not allowed (CC0, public domain, CC BY, CC BY-SA only)`);
const author = plainText(meta.Artist?.value ?? '');
if (!author) fail(`${title} states no author`);

const image = await fetch(info.thumburl ?? info.url, { headers: HEADERS });
if (!image.ok) fail(`image download answered ${image.status}`);
const input = Buffer.from(await image.arrayBuffer());

let out;
for (let quality = 55; quality >= 23; quality -= 8) {
  out = await sharp(input).resize({ width: 1600, withoutEnlargement: true }).avif({ quality, effort: 6 }).toBuffer({ resolveWithObject: true });
  if (out.data.length <= BUDGET) break;
}
if (out.data.length > BUDGET) fail(`could not bring ${name}.avif under ${BUDGET} bytes`);

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `${name}.avif`), out.data);
console.log(`fetch-image: src/study/images/${name}.avif (${out.info.width}×${out.info.height}, ${out.data.length} bytes)\n`);
console.log(`image: {
  file: '${name}.avif',
  width: ${out.info.width},
  height: ${out.info.height},
  alt: { es: '', en: '' }, // describe what the photo shows, in both languages
  author: ${JSON.stringify(author)},
  license: '${license}',
  sourceUrl: '${pageUrl}',
},`);
