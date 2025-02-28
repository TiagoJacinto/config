import { Linter } from 'eslint';
import boundaries from 'eslint-plugin-boundaries';
import base from './base.js';

export default [
  ...base,
  {
    rules: {
      ...boundaries.configs.recommended?.rules,
      'boundaries/no-ignored': 'error',
      'boundaries/no-unknown': 'error',
    },
    settings: {
      'boundaries/dependency-nodes': ['import', 'require', 'export', 'dynamic-import'],
    },
  },
] satisfies Linter.Config[];
