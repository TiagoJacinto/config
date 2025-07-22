import { Linter } from 'eslint';
import svelte from 'eslint-plugin-svelte';

export default (withPrettier:boolean) => [
  ...svelte.configs[withPrettier ? 'flat/prettier' : 'flat/recommended'],
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
