import { Options } from './types';

export default {
  ratios: { refactoring: 1 },
  files: {
    ts: ['**/*.{ts,mts,cts,tsx}'],
    js: ['**/*.{js,mjs,cjs,jsx}'],
  },
} satisfies Options;
