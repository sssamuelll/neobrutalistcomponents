// CSS is shipped as written: light-dark(), @scope, nesting and cascade layers
// are native in every browser the library supports. Lowering light-dark() for
// older targets rewrites it into --lightningcss-* variables that our
// token-driven `color-scheme: var(--nbc-scheme)` never switches on — every
// color would resolve invalid in production.
export const CSS_TARGET = ['chrome123', 'edge123', 'firefox128', 'safari17.5'];
