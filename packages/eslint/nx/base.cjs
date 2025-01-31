const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
];
