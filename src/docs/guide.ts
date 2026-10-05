/**
 * Library-level guidance shared by the docs site, llms.txt / llms-full.txt and
 * the agent skill. Pure data.
 */
import type { NeoBuiltinTheme } from '../lib/themes';

export const PACKAGE = 'neobrutalistcomponents';
export const SITE_URL = 'https://sssamuelll.github.io/neobrutalistcomponents';
export const REPO_URL = 'https://github.com/sssamuelll/neobrutalistcomponents';

/** A page of the site, in English: the language of the generated agent docs. */
export const pageUrl = (path: string): string => `${SITE_URL}/#/en${path}`;

export const TAGLINE = 'Brutalist React components. Core and study themes, light and dark, one token contract.';

export const INSTALL_CODE = 'npm install neobrutalistcomponents';

export const SETUP_CODE = `import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/classic.css';
import 'neobrutalistcomponents/themes/classic.fonts.css'; // optional: loads the theme's fonts

export function App() {
  return (
    <NeoProvider theme="classic" mode="system">
      <Button>Save changes</Button>
    </NeoProvider>
  );
}`;

export const BYO_THEME_CODE = `/* my-theme.css — load it after styles.css */
@layer nbc.tokens, nbc.theme, nbc.base, nbc.components, nbc.flourish;

@layer nbc.theme {
  [data-theme="acme"] {
    --nbc-scheme: light;
    --nbc-font-sans: 'IBM Plex Sans', system-ui, sans-serif;
    --nbc-bg: light-dark(#f6f6f4, #121212);
    --nbc-fg: light-dark(#121212, #f6f6f4);
    --nbc-surface: light-dark(#ffffff, #1c1c1c);
    --nbc-border-color: light-dark(#121212, #f6f6f4);
    --nbc-primary: #ff5c00;
    --nbc-primary-fg: #121212;
    --nbc-radius: 6px;
    --nbc-shadow: 4px 4px 0 var(--nbc-border-color);
    /* every token you leave out falls back to the neutral default */
  }
}`;

/** When to pick each built-in theme. */
export const THEME_GUIDE: Record<NeoBuiltinTheme, { bestFor: string; avoid: string }> = {
  classic: {
    bestFor: 'Product UIs, SaaS dashboards and marketing pages that should feel confident. The default choice.',
    avoid: 'Contexts that need to whisper (medical, legal) — use swiss.',
  },
  tech: {
    bestFor: 'Developer tools, infrastructure consoles, monitoring, anything that lives next to a terminal. Dark by default.',
    avoid: 'Consumer audiences who do not read monospace comfortably.',
  },
  swiss: {
    bestFor: 'Dense admin, finance, analytics, documentation and editorial work where the content has to lead.',
    avoid: 'Playful brands — it is deliberately quiet.',
  },
  y2k: {
    bestFor: 'Playful consumer apps, creative tools, events, fan sites, games.',
    avoid: 'Data-dense tables and long forms.',
  },
  riso: {
    bestFor: 'Editorial sites, portfolios, newsletters, indie products and culture projects.',
    avoid: 'Long transactional forms and dense data.',
  },
};

/** Rules that keep any interface built with the library consistent. */
export const GLOBAL_RULES: readonly string[] = [
  'Wrap the app — or each themed island — in one NeoProvider. Never hard-code colors, fonts, borders or shadows: custom CSS reads the same var(--nbc-*) tokens.',
  'Space with the token scale only: --nbc-space-xs/sm/md/lg/xl/2xl/3xl = 4/8/12/16/24/32/48px.',
  'Controls that sit in one row share one size; Button, Input, Select and Textarea of the same size have the same height in every theme (32 / 40 / 48px).',
  'One primary Button per region (card footer, dialog, form), placed last. Cancel is ghost or secondary.',
  'Every form control has a visible label. Error messages say how to fix the problem.',
  'Inline status → Badge. Block-level message → Alert. Destructive action → danger Button behind a Dialog confirmation.',
  'Group with Card, never nest cards. Lay out pages with your own CSS grid/flex using the spacing tokens.',
  'Icons: any 24px stroke set (the docs use lucide-react). Button and Input size icons for you.',
  'Override with plain CSS — the library lives in cascade layers, so unlayered CSS always wins. Never use !important.',
  'Pick one theme per product. Use mode="system" in apps; leave mode unset for the theme’s native scheme.',
];

export const FONTS_NOTE =
  'The library never loads fonts by itself. Import neobrutalistcomponents/themes/<theme>.fonts.css for a one-line Google Fonts load, or self-host the families listed for each theme.';
