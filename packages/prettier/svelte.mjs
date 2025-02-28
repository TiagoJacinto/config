import base from './base.mjs';

/** @satisfies {import('prettier').Options} */
const config = {
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
};

export default config;
