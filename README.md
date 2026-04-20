# neobrutalistcomponents

Brutalist React components. Four flavors. One switch.

```bash
npm install neobrutalistcomponents
```

```tsx
import { NeoProvider, Button } from 'neobrutalistcomponents';
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

**Components in v0.1:** `Button`, `Input`, `Card`.

**Live demo:** https://samueldarioballesteros.github.io/neobrutalistcomponents (deployed after Phase 10).

## Development

```bash
npm install      # once
npm run dev      # run the landing/playground
npm run test     # run component tests
npm run build    # build lib + site
```

## License

MIT — see `LICENSE`.
