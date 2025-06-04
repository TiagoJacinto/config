import globals from 'globals';
import jest from 'eslint-plugin-jest';
import { Linter } from 'eslint';

export default [
  {
    languageOptions: {
      globals: globals.jest,
    },
    plugins: {
      jest,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': ['error', { ignoreStatic: true }],
    },
  },
] satisfies Linter.Config[];
