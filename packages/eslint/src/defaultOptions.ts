import { Options } from './types.js';

export default {
  ratios: { refactoring: 1 },
  runtimeEnvironment: 'node',
  extensions: { withProjectService: false },
  plugins: { languages: { javascript: false, typescript: false, svelte: false, react: false } },
} satisfies Required<Options>;
