import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, '..', 'src/lib/themes');
const outDir = resolve(__dirname, '..', 'dist/themes');

mkdirSync(outDir, { recursive: true });

for (const file of readdirSync(srcDir)) {
  if (file.endsWith('.css')) {
    copyFileSync(join(srcDir, file), join(outDir, file));
    console.log(`copied ${file}`);
  }
}
