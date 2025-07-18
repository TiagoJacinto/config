import { Linter } from 'eslint';
import { flatConfig } from '@next/eslint-plugin-next';

export default [
  flatConfig.recommended as Linter.Config,
  flatConfig.coreWebVitals as Linter.Config,
] satisfies Linter.Config[];
