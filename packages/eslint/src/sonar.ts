import { mergeDeepLeft } from 'ramda';
import sonar from 'eslint-plugin-sonarjs';
import defaultOptions from './defaultOptions.js';
import { Linter } from 'eslint';

export default ({ ratios }: { ratios?: Partial<Record<'refactoring', number>> } = {}) => {
  ratios ??= { refactoring: 1 };

  const mergedRatios = mergeDeepLeft(ratios, defaultOptions.ratios);

  return [
    sonar.configs.recommended,
    {
      rules: {
        'sonarjs/no-duplicate-string': [
          'warn',
          {
            threshold:
              mergedRatios.refactoring <= 0
                ? 1
                : Math.max(1, Math.round(3 / mergedRatios.refactoring)),
          },
        ],
      },
    },
  ] satisfies Linter.Config[];
};
