module.exports = [
  require('eslint-config-prettier'),
  ...require('./typescript.cjs').map((c) => ({ ...c, files: ['**/*.{ts,tsx}'] })),
  ...require('./javascript.cjs').map((c) => ({ ...c, files: ['**/*.{js,jsx}'] })),
];
