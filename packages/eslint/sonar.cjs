/**
 * @param {Options} options
 */
module.exports = ({ ratios } = { ratios: { refactoring: 1 } }) => [
  require('eslint-plugin-sonarjs').configs.recommended,
  {
    rules: {
      'sonarjs/no-duplicate-string': ['warn', { threshold: Math.round(3 * ratios.refactoring) }],
    },
  },
];
