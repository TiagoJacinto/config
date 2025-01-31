module.exports = [
  {
    plugins: {
      jest: require('eslint-plugin-jest'),
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': ['error', { ignoreStatic: true }],
    },
  },
];
