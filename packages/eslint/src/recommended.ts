import { Options } from './types.js';
import { mergeDeepLeft } from 'ramda';
import sonar from './sonar.js';
import javascript from './javascript.js';
import typescript from './typescript.js';
import defaultOptions from './defaultOptions.js';
import type { Linter } from 'eslint';
import importHelpers from 'eslint-plugin-import-helpers';

function packageExists(name: string) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

const isPrettierAvailable = packageExists('prettier') && packageExists('eslint-config-prettier');

export default (options: Options = {}) => {
  options = mergeDeepLeft(options, defaultOptions);

  return [
    ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
    ...sonar(options),
    ...javascript.map((c) => ({
      ...c,
      files: options.files!.js!,
    })),
    ...typescript.map((c) => ({
      ...c,
      files: options.files!.ts!,
    })),
    {
      files: [...options.files!.js!, ...options.files!.ts!],
      plugins: {
        'import-helpers': importHelpers,
      },
      rules: {
        'import-helpers/order-imports': [
          'warn',
          {
            newlinesBetween: 'always',
            groups: ['module', ['parent', 'sibling'], 'index'],
            alphabetize: { order: 'asc', ignoreCase: true },
          },
        ],
      },
    },
  ] as Linter.Config[];
};
