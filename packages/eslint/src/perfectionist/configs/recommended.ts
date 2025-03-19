import { Linter } from 'eslint';
import perfectionist from 'eslint-plugin-perfectionist';

const defaultOptions = {
  newlinesBetween: 'always',
};

const defaultObjectTypeOptions = {
  groups: ['index-signature', 'top-property', 'property', 'bottom-property', 'method'],
  customGroups: [
    {
      groupName: 'top-property',
      selector: 'property',
      elementNamePattern: '^(?:id|name)$',
    },
    {
      groupName: 'bottom-property',
      selector: 'property',
      elementNamePattern: 'At',
    },
  ],
};

export default (environment: string) =>
  [
    {
      ...perfectionist.configs['recommended-natural'],
      rules: {
        'perfectionist/sort-objects': [
          'error',
          {
            ...defaultOptions,
            group: ['property', 'method'],
          },
        ],
        'perfectionist/sort-interfaces': [
          'error',
          {
            ...defaultOptions,
            ...defaultObjectTypeOptions,
          },
        ],
        'perfectionist/sort-object-types': [
          'error',
          {
            ...defaultOptions,
            ...defaultObjectTypeOptions,
          },
        ],
        'perfectionist/sort-union-types': [
          'error',
          {
            ...defaultOptions,
            group: [
              // Needs to be in this order
              'keyword',
              'operator',
              'literal',
              //
              'named',
              //
              'import',
              //
              'tuple',
              'object',
              // Needs to be in this order
              ['union', 'intersection'],
              //
              'conditional',
              'function',
              //
              'nullish',
            ],
          },
        ],
        'perfectionist/sort-intersection-types': [
          'error',
          {
            ...defaultOptions,
            // Needs to be in this order
            // nullish
            // literal
            // operator
            // keyword
            groups: [
              'nullish',
              'conditional',
              'import',
              'named',
              'literal',
              'operator',
              ['intersection', 'union'],
              'function',
              'tuple',
              'object',
              'keyword',
            ],
          },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          {
            ...defaultOptions,
            groupKind: 'types-first',
            environment,
          },
        ],
      },
    },
  ] satisfies Linter.Config[];
