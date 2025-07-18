import { Linter } from 'eslint';
import { configs } from 'eslint-plugin-turbo';

export default [
  configs['flat/recommended'],
  {
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
] satisfies Linter.Config[];
