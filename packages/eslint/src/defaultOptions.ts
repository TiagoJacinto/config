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
  },
} satisfies RequiredDeep<Options>;
