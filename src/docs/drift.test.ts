/**
 * Docs drift guard (spec D13): metadata must describe the code exactly.
 * - meta.props ≡ own members of `<Name>Props` (parsed with the TS compiler API)
 * - subcomponent props ≡ their `propsInterface`
 * - every example file exists, every public class hook exists in the CSS
 * - every component exported from the library has metadata
 */
import { describe, it, expect } from 'vitest';
import ts from 'typescript';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS } from './meta';
import { SLUGS } from './slugs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LIB = join(ROOT, 'src/lib');

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function interfaceMembers(folder: string, name: string): string[] {
  for (const file of readdirSync(folder).filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'))) {
    const path = join(folder, file);
    const src = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    let members: string[] | undefined;
    src.forEachChild((node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === name) {
        members = node.members.filter(ts.isPropertySignature).map((m) => m.name.getText(src));
      }
    });
    if (members) return members.sort();
  }
  throw new Error(`interface ${name} not found in ${folder}`);
}

function exportedComponents(): string[] {
  const index = readFileSync(join(LIB, 'index.ts'), 'utf8');
  return [...index.matchAll(/^export \{ ([^}]+) \} from '\.\/([A-Z]\w+)';$/gm)]
    .filter(([, , folder]) => folder !== 'NeoProvider')
    .flatMap(([, names]) => names.split(',').map((n) => n.trim()))
    .filter((n) => /^[A-Z]/.test(n));
}

describe('docs metadata', () => {
  it('documents every exported component', () => {
    const documented = new Set(COMPONENTS.flatMap((c) => [c.name, ...(c.subcomponents ?? []).map((s) => s.name)]));
    expect(exportedComponents().filter((n) => !documented.has(n))).toEqual([]);
  });

  it('slugs.ts (used by the E2E suite) lists every component', () => {
    expect([...SLUGS].sort()).toEqual(COMPONENTS.map((c) => c.slug).sort());
  });

  it('has unique slugs', () => {
    const slugs = COMPONENTS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  describe.each(COMPONENTS.map((c) => [c.name, c] as const))('%s', (_name, meta) => {
    const folder = join(LIB, meta.name);

    it('slug is the kebab-case name', () => {
      expect(meta.slug).toBe(kebab(meta.name));
    });

    it('props match the TypeScript interface', () => {
      expect(meta.props.map((p) => p.name).sort()).toEqual(interfaceMembers(folder, `${meta.name}Props`));
    });

    it('subcomponent props match their interfaces', () => {
      for (const sub of meta.subcomponents ?? []) {
        if (!sub.propsInterface) continue;
        expect((sub.props ?? []).map((p) => p.name).sort(), sub.name).toEqual(
          interfaceMembers(folder, sub.propsInterface),
        );
      }
    });

    it('has at least two examples and every example file exists', () => {
      expect(meta.examples.length).toBeGreaterThanOrEqual(2);
      for (const ex of meta.examples) {
        expect(existsSync(join(ROOT, 'src/docs/examples', meta.name, `${ex.file}.tsx`)), ex.file).toBe(true);
      }
    });

    it('every public class hook exists in the stylesheet', () => {
      const css = readdirSync(folder)
        .filter((f) => f.endsWith('.css'))
        .map((f) => readFileSync(join(folder, f), 'utf8'))
        .join('\n')
        .concat(readFileSync(join(LIB, 'internal/Field.css'), 'utf8'));
      for (const cls of meta.classes) {
        expect(css.includes(`.${cls}`), cls).toBe(true);
      }
    });

    it('has the prose an agent needs', () => {
      expect(meta.summary.length).toBeGreaterThan(20);
      expect(meta.whenToUse.length).toBeGreaterThan(0);
      expect(meta.whenNotToUse.length).toBeGreaterThan(0);
      expect(meta.accessibility.length).toBeGreaterThan(0);
      expect(meta.rules.length).toBeGreaterThan(0);
    });
  });
});
