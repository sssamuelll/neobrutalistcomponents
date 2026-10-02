# Migrating from 0.2 to 1.0

1.0 is a rebuild on a new token contract. Most apps need five small edits.

## 1. Stylesheets

```diff
- import 'neobrutalistcomponents/neobrutalistcomponents.css';
+ import 'neobrutalistcomponents/styles.css';        // the old path still works
  import 'neobrutalistcomponents/themes/classic.css';
+ import 'neobrutalistcomponents/themes/classic.fonts.css'; // optional
```

Themes are now cascade-layered. Your own unlayered CSS overrides the library without `!important`; remove any `!important` you added to fight it.

## 2. Input

| 0.2 | 1.0 |
| --- | --- |
| `variant="error" errorMessage="…"` | `error="…"` |
| `variant="error"` (no message) | `error` (`true`) |
| `helperText="…"` | `description="…"` |
| `className` on the wrapper | unchanged |

The same `label` / `description` / `error` API is used by Textarea, Select, Checkbox and RadioGroup.

## 3. Button

- Defaults to `type="button"`. Add `type="submit"` to buttons that submit forms.
- The `nbc-button--icon-only` class is applied automatically when there is no label and exactly one icon. Remove it from your `className`.
- New: `asChild` renders a link or router `Link` with button styles.

## 4. NeoProvider / useTheme

- `useTheme()` returns `{ theme, mode } | undefined` instead of a string.
- New `mode` prop: `'light' | 'dark' | 'system'`. Omit it to keep each theme's native scheme (classic, swiss, y2k, riso: light; tech: dark).
- The provider now paints `background`, `color` and `font-family` (class `nbc-root`).

## 5. Tokens

If you wrote a custom theme, rename:

| 0.2 | 1.0 |
| --- | --- |
| `--nbc-primary-accent` | `--nbc-accent` |
| `--nbc-button-radius` | `--nbc-radius-button` |
| `--nbc-input-radius` | `--nbc-radius-control` |
| `--nbc-button-shadow-hover` | `--nbc-shadow-press` |
| `--nbc-input-shadow-error` | removed (invalid fields thicken their border) |
| `--nbc-card-header-bg`, `--nbc-card-padding-content`, `--nbc-grid-overlay`, `--nbc-holo-gradient`, `--nbc-hairline` | removed (use `--nbc-texture` and theme flourishes) |
| gradients in `--nbc-primary` / `--nbc-danger` | solid colors; put gradients in `--nbc-primary-fill` / `--nbc-danger-fill` |

Font-size and spacing scales changed slightly (`--nbc-space-lg` 18 → 16px, `--nbc-fs-xl` 24 → 22px, new `2xl`/`3xl`/`4xl` steps).

## 6. Packaging

ESM only (`dist/index.js`). Node ≥ 20.19 can `require()` it; every current bundler imports it natively. The CJS build is gone.
