# neobrutalistcomponents

Brutalist React components. Four flavors. One switch.

```bash
npm install neobrutalistcomponents
```

```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
import 'neobrutalistcomponents/neobrutalistcomponents.css';
import 'neobrutalistcomponents/themes/classic.css';

export function App() {
  return (
    <NeoProvider theme="classic">
      <Button>Click me</Button>
    </NeoProvider>
  );
}
```

**Themes:** `classic` · `tech` · `swiss` · `y2k` — import only the ones you use.

**Components in v0.2:** `Button`, `Input`, `Card`.

**Live demo:** https://sssamuelll.github.io/neobrutalistcomponents

## Fonts

Each theme expects specific font families. The library does **not** load any fonts — you're responsible for making them available. Easiest option is the Google Fonts CDN via `<link>` tags in your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&family=VT323&family=Sixtyfour&family=Bungee+Shade&display=swap" />
```

Or self-host via [@fontsource](https://fontsource.org/). Per theme:

| Theme    | Families                                          |
| -------- | ------------------------------------------------- |
| classic  | Inter + Space Grotesk + JetBrains Mono            |
| tech     | Geist Mono + JetBrains Mono                       |
| swiss    | Inter Tight (Helvetica Neue stand-in) + JetBrains |
| y2k      | VT323 + Sixtyfour + Bungee Shade                  |

If you load only the themes you use, you can trim the family list accordingly.

## Development

```bash
npm install      # once
npm run dev      # run the landing/playground
npm run test     # run component tests
npm run build    # build lib + site
```

## License

MIT — see `LICENSE`.
