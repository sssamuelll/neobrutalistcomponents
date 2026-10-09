// Checks the study's links before a ficha ships. Needs the network; not part of CI.
//
//   node scripts/check-links.mjs                        every theme's sources and fonts
//   node scripts/check-links.mjs --themes=a,b           only these themes
//   node scripts/check-links.mjs --dossier=<file.json>  each claim's quote is on its page
//
// OK: answered 200 (and a dossier quote is on the page). HAND: the site refuses
// scripts (401, 403, 429) or serves a PDF: open it yourself. FAIL: anything else.
// Exits 1 on any FAIL.
import { runnerImport } from 'vite';
import { readFileSync } from 'node:fs';
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

const verdict = (status) => (status === 200 ? 'OK' : [401, 403, 429].includes(status) ? 'HAND' : 'FAIL');
const normalize = (text) =>
  text
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
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
  const claims = [...(dossier.lettering?.claims ?? []), ...(dossier.motion?.claims ?? [])];
  for (const { url, quote, text } of claims) {
    const res = await get(url);
    const label = `"${(quote ?? '').slice(0, 60)}"`;
    if (res.type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) report('HAND', res.status, `${label} (PDF)`, url);
    else if (res.status !== 200) report(verdict(res.status), res.status, label, url);
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
      report(verdict(res.status), res.status, `${theme.id} source`, source.url);
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
