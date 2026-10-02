/**
 * A tiny, deterministic TSX/CSS/shell highlighter for the docs: comments,
 * strings, keywords, JSX tags and numbers. Monochrome by design — weight and
 * tone carry the structure, so it is legible in every theme and scheme.
 */
export type TokenKind = 'comment' | 'string' | 'keyword' | 'tag' | 'number' | 'plain';
export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set(
  'import export from default function return const let var if else for of in new type interface extends as async await true false null undefined typeof'.split(
    ' ',
  ),
);

const PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w.]*|\/?>)|(\b\d+(?:\.\d+)?(?:px|ms|em|%)?\b)|([A-Za-z_$][\w$-]*)/g;

export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of code.matchAll(PATTERN)) {
    const index = m.index ?? 0;
    if (index > last) tokens.push({ kind: 'plain', text: code.slice(last, index) });
    const [text, comment, string, tag, number, word] = m;
    let kind: TokenKind = 'plain';
    if (comment) kind = 'comment';
    else if (string) kind = 'string';
    else if (tag) kind = 'tag';
    else if (number) kind = 'number';
    else if (word && KEYWORDS.has(word)) kind = 'keyword';
    tokens.push({ kind, text });
    last = index + text.length;
  }
  if (last < code.length) tokens.push({ kind: 'plain', text: code.slice(last) });
  return tokens;
}
