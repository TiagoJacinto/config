import { Linter } from 'eslint';

export default [
  {
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
] satisfies Linter.Config[];
