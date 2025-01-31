module.exports = [
  require('eslint-config-prettier'),
  ...require('./typescript/base.cjs').map((c) => ({ ...c, files: ['**/*.{ts,tsx}'] })),
  ...require('./javascript.cjs').map((c) => ({ ...c, files: ['**/*.{js,jsx}'] })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    plugins: {
      'import-helpers': require('eslint-plugin-import-helpers'),
    },
    rules: {
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: ['module', ['parent', 'sibling'], 'index'],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },
];
