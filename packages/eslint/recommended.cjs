require('./types');
const { mergeDeepLeft } = require('ramda');

function packageExists(/**@type {string}*/ name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

const isPrettierAvailable = packageExists('prettier') && packageExists('eslint-config-prettier');

const defaultOptions = {
  ratios: { refactoring: 1 },
  files: {
    ts: ['**/*.{ts,mts,cts,tsx}'],
    js: ['**/*.{js,mjs,cjs,jsx}'],
  },
};

/**
 * @param {Options} options
 */
module.exports = (options) => {
  options = mergeDeepLeft(options, defaultOptions);

  return [
    ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
    ...require('./sonar.cjs')(options),
    ...require('./javascript.cjs').map((c) => ({
      ...c,
      files: options.files.js,
    })),
    ...require('./typescript.cjs').map((c) => ({
      ...c,
      files: options.files.ts,
    })),
    {
      files: [...options.files.js, ...options.files.ts],
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
};
