function packageExists(/**@type {string}*/ name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

const isPrettierAvailable = packageExists('prettier') && packageExists('eslint-config-prettier');

module.exports = /**@type {string}*/ [
  //@ts-ignore
  ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
  require('eslint-plugin-sonarjs').configs.recommended,
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
