declare module 'eslint-plugin-import-helpers' {
  import { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-boundaries' {
  import { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & { configs: Record<string, Linter.Config> };
  export default plugin;
}
