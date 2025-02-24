/**
 * @param {Options} options
 */
module.exports = ({ ratios } = { ratios: { refactoring: 1 } }) => [
  require('eslint-plugin-sonarjs').configs.recommended,
  {
    rules: {
      'sonarjs/no-duplicate-string': [
        'warn',
        {
          threshold: ratios.refactoring <= 0 ? 1 : Math.max(1, Math.round(3 / ratios.refactoring)),
        },
      ],
    },
  },
];
