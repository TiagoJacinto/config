function packageExists(/**@type {string}*/ name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

const isPrettierAvailable = packageExists('prettier') && packageExists('eslint-config-prettier');

/**
 * @param {Options} options
 */
module.exports = (options = { ratios: { refactoring: 1 } }) => [
  //@ts-ignore
  ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
  ...require('./sonar.cjs')(options),
  ...require('./typescript.cjs').map((c) => ({ ...c, files: ['**/*.{ts,tsx}'] })),
  ...require('./javascript.cjs').map((c) => ({ ...c, files: ['**/*.{js,jsx}'] })),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    plugins: {
      //@ts-ignore
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
