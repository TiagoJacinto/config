import { mergeDeepLeft } from 'ramda';
import sonar from 'eslint-plugin-sonarjs';
import defaultOptions from './defaultOptions.js';
import { Options } from './types.js';

export default ({ ratios }: Options = {}) => {
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
  ];
};
