import { Linter } from 'eslint';
import perfectionist from 'eslint-plugin-perfectionist';

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
            newlinesBetween: 'always',
            groups: ['property', 'method'],
          },
        ],
        'perfectionist/sort-interfaces': [
          'error',
          {
            newlinesBetween: 'always',
            ...defaultObjectTypeOptions,
          },
        ],
        'perfectionist/sort-object-types': [
          'error',
          {
            newlinesBetween: 'always',
            ...defaultObjectTypeOptions,
          },
        ],
        'perfectionist/sort-union-types': [
          'error',
          {
            newlinesBetween: 'always',
            groups: [
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
            newlinesBetween: 'always',
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
        'perfectionist/sort-imports': [
          'error',
          {
            newlinesBetween: 'always',
            environment,
          },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          {
            groupKind: 'types-first',
          },
        ],
      },
    },
  ] satisfies Linter.Config[];
