import { Linter } from 'eslint';
import react from '@eslint-react/eslint-plugin';
import base from './base.js';
import { config } from 'typescript-eslint';

export default config({
  extends: [base, react.configs['recommended-type-checked']],
}) as Linter.Config[];
