import { Options } from './types.mjs';

export default {
  ratios: { refactoring: 1 },
  files: {
    ts: ['**/*.{ts,mts,cts,tsx}'],
    js: ['**/*.{js,mjs,cjs,jsx}'],
  },
} satisfies Options;
