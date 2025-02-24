const { mergeDeepLeft } = require('ramda');

/**
 * @param {Options["ratios"]} options
 */
module.exports = (ratios) => {
  ratios = mergeDeepLeft(ratios, require('./defaultOptions.cjs').ratios);

  return [
    require('eslint-plugin-sonarjs').configs.recommended,
    {
      rules: {
        'sonarjs/no-duplicate-string': [
          'warn',
          {
            threshold:
              ratios.refactoring <= 0 ? 1 : Math.max(1, Math.round(3 / ratios.refactoring)),
          },
        ],
      },
    },
  ];
};
