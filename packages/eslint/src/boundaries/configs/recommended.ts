import { Linter } from 'eslint';
import boundaries from 'eslint-plugin-boundaries';
import base from './base.js';

export default [
  ...base,
  {
    rules: {
      ...boundaries.configs.recommended?.rules,
    },
  },
] satisfies Linter.Config[];
