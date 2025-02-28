import { mergeDeepLeft } from 'ramda';
import sonar from 'eslint-plugin-sonarjs';
import defaultOptions from './defaultOptions';
import { Options } from './types';

export default ({ ratios }: Options = {}) => {
  ratios ??= { refactoring: 1 };

  ratios = mergeDeepLeft(ratios, defaultOptions.ratios);

  return [
    sonar.configs.recommended,
    {
      rules: {
        'sonarjs/no-duplicate-string': [
          'warn',
          {
            threshold:
              ratios.refactoring! <= 0 ? 1 : Math.max(1, Math.round(3 / ratios.refactoring!)),
          },
        ],
      },
    },
  ];
};
