import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: { ...globals.serviceworker, ...globals.browser },
    },
  },
];
