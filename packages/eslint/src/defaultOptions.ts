import { RequiredDeep } from 'type-fest';
import { Options } from './types.js';

export default {
  ratios: { refactoring: 1 },
  runtimeEnvironment: 'node',
  extensions: { withProjectService: false },
  plugins: {
    formatting: {
      perfectionist: false,
    },
    languages: { javascript: false, typescript: false, svelte: false, react: false },
    testing: {
      jest: false,
    },
    build: {
      turbo: false,
    },
    frameworks: {
      next: false,
    },
  },
} satisfies RequiredDeep<Options>;
