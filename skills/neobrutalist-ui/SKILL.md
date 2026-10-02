---
name: neobrutalist-ui
description: Build React interfaces with the neobrutalistcomponents library — pick a theme, compose screens from its 16 components, and follow its composition rules. Use when a project depends on neobrutalistcomponents or the user asks for a brutalist / neobrutalist UI in React.
---

# Building with neobrutalistcomponents

The library is deterministic by design: one token contract, invariant control heights, closed variant sets. Follow these steps and two agents given the same brief produce the same screen.

## 1. Setup (once)

```tsx
import { NeoProvider } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/styles.css';
import 'neobrutalistcomponents/themes/<theme>.css';
import 'neobrutalistcomponents/themes/<theme>.fonts.css'; // unless fonts are self-hosted

<NeoProvider theme="<theme>" mode="system">{app}</NeoProvider>
```

## 2. Pick the theme

| Theme | Choose for | Avoid for |
| --- | --- | --- |
| classic | SaaS products, dashboards, marketing — the default | quiet/regulated contexts |
| tech | developer tools, consoles, monitoring (dark native) | non-technical consumer audiences |
| swiss | dense admin, finance, docs, editorial | playful brands |
| y2k | playful consumer apps, creative tools, events | dense tables, long forms |
| riso | editorial, portfolios, newsletters, indie products | long transactional forms |

Pick one per product. Apps: `mode="system"`. Marketing pages: leave `mode` unset.

## 3. Compose

- Actions → `Button` (`primary` | `secondary` | `danger` | `ghost`; `size` sm/md/lg). One primary per region, placed last. Links that look like buttons: `<Button asChild><a href>…</a></Button>`.
- Text input → `Input` (one line) or `Textarea` (more). Choice from a list → `Select` (many options) or `RadioGroup` (2–5 visible options). Yes/no in a form → `Checkbox`; setting that applies instantly → `Switch`.
- Every field: `label` always, `description` for help, `error="what to do"` when invalid.
- Grouping → `Card` (+ `Card.Header/Title/Description/Content/Footer`). Never nest cards. Clickable card → `variant="interactive"` with a link inside `Card.Title`.
- Inline status → `Badge`. Block message → `Alert` (add `role="alert"`/`"status"` only when it appears dynamically).
- Numbers over time / quotas → `Progress`. Rows of records → `Table` (`numeric` cells for figures).
- Shortcuts → `Kbd`. Sections in one place → `Tabs`. Confirmations and focused tasks → controlled `Dialog` (`open` + `onOpenChange`). Naming icon-only buttons → `Tooltip` (still pass `aria-label`).

## 4. Rules

1. Never hard-code colors, fonts, borders or shadows; custom CSS reads `var(--nbc-*)` tokens.
2. Space only with `--nbc-space-xs/sm/md/lg/xl/2xl/3xl` (4/8/12/16/24/32/48px).
3. Controls in one row share one `size`.
4. Labels are verbs naming the outcome ("Save changes", "Delete project"), sentence case.
5. Destructive actions: `danger` button inside a `Dialog` confirmation.
6. Layout is yours: CSS grid/flex outside the components.
7. Override with plain CSS (the library is in cascade layers); never `!important`.

## 5. Reference

Full props, rules and example code for every component:
`node_modules/neobrutalistcomponents/dist/llms-full.txt` (or https://sssamuelll.github.io/neobrutalistcomponents/llms-full.txt).
