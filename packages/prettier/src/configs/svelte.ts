import { Options } from 'prettier';
import base from './base.js';

export default {
  ...base,
  useTabs: true,
  trailingComma: 'none',
  plugins: ['prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
} satisfies Options;
