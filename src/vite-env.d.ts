/// <reference types="vite/client" />

/** Study essays, rendered to HTML by vite-plugin-essays.ts. */
declare module '*.md' {
  const html: string;
  export default html;
}
