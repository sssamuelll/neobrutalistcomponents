// Checks the study's links before a ficha ships. Needs the network; not part of CI.
//
//   node scripts/check-links.mjs                        every theme's sources and fonts
//   node scripts/check-links.mjs --themes=a,b           only these themes
//   node scripts/check-links.mjs --dossier=<file.json>  each claim's quote is on its page
//
// OK: answered 200 (and a dossier quote is on the page or in the PDF's text). HAND:
// the site refuses scripts (401, 403, 429), or a PDF could not be read: open it
// yourself. FAIL: anything else.
// Exits 1 on any FAIL.
import { runnerImport } from 'vite';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const load = async (file) => (await runnerImport(join(ROOT, file), { configFile: false, logLevel: 'silent' })).module;
const UA = { 'user-agent': 'Mozilla/5.0 (neobrutalistcomponents link check)' };

async function get(url) {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    const type = res.headers.get('content-type') ?? '';
    return { status: res.status, type, text: res.ok && !type.includes('pdf') ? await res.text() : '' };
  } catch (error) {
    return { status: 0, type: '', text: '', error: error.message };
  }
}

/** A PDF's text through pdftotext (poppler), or null when it cannot be read. One download per URL. */
const pdfCache = new Map();
async function pdfText(url) {
  if (!pdfCache.has(url)) {
    pdfCache.set(
      url,
      (async () => {
        try {
          const res = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(60_000) });
          if (!res.ok) return null;
          const dir = mkdtempSync(join(tmpdir(), 'check-links-'));
          const file = join(dir, 'doc.pdf');
          writeFileSync(file, Buffer.from(await res.arrayBuffer()));
          try {
            return execFileSync('pdftotext', ['-enc', 'UTF-8', file, '-'], { maxBuffer: 1 << 28 }).toString('utf8');
          } finally {
            rmSync(dir, { recursive: true, force: true });
          }
        } catch {
          return null;
        }
      })(),
    );
  }
  return pdfCache.get(url);
}

const verdict = (status) => (status === 200 ? 'OK' : [401, 403, 429].includes(status) ? 'HAND' : 'FAIL');
const MARKS = { acute: 0x301, grave: 0x300, circ: 0x302, tilde: 0x303, uml: 0x308, cedil: 0x327, ring: 0x30a };
const normalize = (text) =>
  text
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, ' $1 ') // a photograph's alt text is part of what the page says
    .replace(/<\/?(?:a|abbr|b|cite|code|em|i|small|span|strong|sub|sup)\b[^>]*>/gi, '') // inline tags join text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z])(acute|grave|circ|tilde|uml|cedil|ring);/gi, (_, letter, mark) => letter + String.fromCharCode(MARKS[mark.toLowerCase()]))
    .replace(/&szlig;/g, 'ß')
    .normalize('NFKC')
    .replace(/&nbsp;/g, ' ')
    .replaceAll(String.fromCharCode(0xa0), ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;|&rsquo;|&lsquo;|[’‘]/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;|[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .toLowerCase();

const lines = [];
const report = (state, status, label, url) => lines.push(`${state.padEnd(4)} ${String(status).padEnd(3)} ${label}  ${url}`);

const dossierPath = arg('dossier');
if (dossierPath) {
  const dossier = JSON.parse(readFileSync(dossierPath, 'utf8'));
  const claims = [
    ...(dossier.facts ?? []),
    ...(dossier.palette?.documented ?? []).map((claim) => ({ ...claim, text: claim.colour })),
    ...(dossier.lettering?.claims ?? []),
    ...(dossier.motion?.claims ?? []),
  ];
  for (const { url, quote, text } of claims) {
    const res = await get(url);
    const label = `"${(quote ?? '').slice(0, 60)}"`;
    if (res.status !== 200) report(verdict(res.status), res.status, res.error ? `${label} (${res.error})` : label, url);
    else if (res.type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
      const body = await pdfText(url);
      // A line-wrapped PDF splits words at hyphens: try the text with and without them.
      const variants = body === null ? [] : [body.replaceAll(String.fromCharCode(45, 10), ''), body.replaceAll(String.fromCharCode(45, 13, 10), ''), body];
      const found = Boolean(quote) && variants.some((variant) => normalize(variant).includes(normalize(quote)));
      if (body === null) report('HAND', res.status, label + ' (PDF could not be downloaded or read; pdftotext must be on the PATH)', url);
      else report(found ? 'OK' : 'FAIL', 200, found ? label + ' (PDF)' : label + ' not in the PDF (claim: ' + text + ')', url);
    }
    else if (!quote || !normalize(res.text).includes(normalize(quote))) report('FAIL', 200, `${label} not on the page (claim: ${text})`, url);
    else report('OK', 200, label, url);
  }
} else {
  const { STUDY_THEMES } = await load('src/study/registry.ts');
  const { FONTS, googleFontsUrl } = await load('src/study/fonts.ts');
  const wanted = arg('themes')?.split(',');
  const themes = STUDY_THEMES.map(({ theme }) => theme).filter((theme) => !wanted || wanted.includes(theme.id));
  for (const theme of themes) {
    for (const source of theme.reference.sources) {
      const res = await get(source.url);
      report(verdict(res.status), res.status, res.error ? `${theme.id} source (${res.error})` : `${theme.id} source`, source.url);
    }
    if (theme.reference.archiveUrl) {
      const res = await get(theme.reference.archiveUrl);
      report(verdict(res.status), res.status, `${theme.id} archive`, theme.reference.archiveUrl);
    }
  }
  const keys = [...new Set(themes.flatMap(({ fonts }) => (typeof fonts === 'string' ? [] : [fonts.sans, fonts.display, fonts.mono].filter(Boolean))))];
  for (const key of keys) {
    const font = FONTS[key];
    const css = await get(googleFontsUrl([key]));
    report(verdict(css.status), css.status, `font ${key} css2`, googleFontsUrl([key]));
    const dir = font.family.toLowerCase().replace(/[^a-z0-9]/g, '');
    const expected = font.license === 'OFL-1.1' ? 'ofl' : 'apache';
    let found = null;
    for (const folder of ['ofl', 'apache', 'ufl']) {
      if ((await get(`https://raw.githubusercontent.com/google/fonts/main/${folder}/${dir}/METADATA.pb`)).status === 200) {
        found = folder;
        break;
      }
    }
    const label = `font ${key} licence: registry ${font.license}, google/fonts ${found ?? 'not found'}`;
    report(found === expected ? 'OK' : 'FAIL', found ?? '-', label, `https://github.com/google/fonts/tree/main/${found ?? expected}/${dir}`);
  }
}

console.log(lines.join('\n'));
const failed = lines.filter((line) => line.startsWith('FAIL')).length;
const hand = lines.filter((line) => line.startsWith('HAND')).length;
console.log(`\ncheck-links: ${lines.length} checked, ${failed} FAIL, ${hand} HAND`);
process.exit(failed ? 1 : 0);
