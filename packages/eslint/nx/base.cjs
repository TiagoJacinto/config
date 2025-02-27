const nx = require('@nx/eslint-plugin');

export default [
  ...nx.configs['flat/base'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
];
