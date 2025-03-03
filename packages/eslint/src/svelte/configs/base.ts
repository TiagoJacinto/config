import { Linter } from 'eslint';
import { isPrettierAvailable } from '../../lib/env.js';
import svelte from 'eslint-plugin-svelte';

export default [
  ...svelte.configs[isPrettierAvailable ? 'flat/prettier' : 'flat/recommended'],
  {
    rules: {
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
    },
  },
] satisfies Linter.Config[];
