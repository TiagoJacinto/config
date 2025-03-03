import { Options } from './types.js';

export default {
  ratios: { refactoring: 1 },
  extensions: { withProjectService: false },
  plugins: { javascript: false, typescript: false, svelte: false },
} satisfies Required<Options>;
