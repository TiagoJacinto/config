import { Linter } from 'eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import { UnknownRecord } from 'type-fest';
import {
  NewLinesBetween,
  NewLinesBetweenSeparator,
  withNewlinesBetween,
} from '../utils/withNewlinesBetween.js';

const cleanse = (obj: UnknownRecord) => {
  const result = obj;
  for (const v in result) {
    if (typeof result[v] === 'object' && result[v] !== null) cleanse(result[v] as UnknownRecord);
    else if (result[v] === undefined) delete result[v];
  }
  return result;
};

type Group = string | NewLinesBetweenSeparator;

type GroupDefinition =
  | Group
  | {
      groups: GroupDefinition[];
      newlinesBetween?: NewLinesBetween;
    };

type GroupsDefinition = GroupDefinition | GroupDefinition[];

function resolveGroups(groups: GroupsDefinition[]) {
  type Groups = Group | Group[];
  const recursive = (groups: GroupsDefinition[]) => {
    const result: Groups[] = [];

    for (const group of groups) {
      if (Array.isArray(group)) {
        result.push(
          group.flatMap((g) =>
            typeof g === 'object' && 'groups' in g
              ? recursive(withNewlinesBetween(g.groups, g.newlinesBetween ?? 'ignore')).flat()
              : g
          )
        );
        continue;
      }

      if (typeof group === 'object' && 'groups' in group) {
        result.push(
          ...recursive(withNewlinesBetween(group.groups, group.newlinesBetween ?? 'ignore'))
        );
        continue;
      }

      result.push(group);
    }

    return result;
  };

  return recursive(groups);
}

const sort = ({ groups, ...rest }: { groups?: GroupsDefinition[]; [k: string]: unknown }) => {
  // priorities: {
  //   method: {
  //     tiago: 3,
  //     world: 2,
  //     verhaeghe: 5,
  //     jacinto: 4,
  //     hello: 1,
  //   },
  // },

  // toPairs(priorities[g])
  //   .sort(([, v1], [, v2]) => v1 - v2)
  //   .map(([k]) => k);

  return cleanse({
    ...rest,
    groups: groups && resolveGroups(groups),
  });
};

const config = ({ environment }: { environment: string }): Linter.Config[] => [
  {
    plugins: {
      perfectionist,
    },
    settings: {
      perfectionist: {
        type: 'unsorted',
      },
    },
    rules: {
      'perfectionist/sort-array-includes': 'warn',
      'perfectionist/sort-classes': [
        'warn',
        sort({
          groups: [
            'index-signature',
            'static-property',
            'static-block',
            ['protected-property', 'protected-accessor-property'],
            ['private-property', 'private-accessor-property'],
            ['property', 'accessor-property'],
            'constructor',
            'static-method',
            'method',
            ['get-method', 'set-method'],
            'unknown',
          ],
          customGroups: [
            {
              selector: 'static-block',
            },
            {
              selector: 'method',
              modifier: 'static',
            },
            {
              selector: 'method',
              modifier: 'protected',
            },
            {
              selector: 'method',
              modifier: 'private',
            },
            {
              selector: 'method',
            },
            {
              selector: 'get-method',
            },
            {
              selector: 'set-method',
            },
          ].map(({ selector, modifier }) => ({
            groupName: modifier ? `${modifier}-${selector}` : selector,
            selector,
            modifiers: modifier && [modifier],
            newlinesInside: 'always',
          })),
        }),
      ],
      'perfectionist/sort-decorators': 'warn',
      'perfectionist/sort-enums': 'warn',
      'perfectionist/sort-imports': [
        'warn',
        {
          environment,
        },
      ],
      'perfectionist/sort-named-imports': [
        'warn',
        {
          groupKind: 'types-first',
        },
      ],
      'perfectionist/sort-exports': ['warn'],
      'perfectionist/sort-named-exports': ['warn'],
      'perfectionist/sort-heritage-clauses': ['warn'],
      'perfectionist/sort-objects': [
        'warn',
        sort({
          groups: ['top-property', 'property', 'bottom-property'],
          customGroups: [
            {
              groupName: 'top-property',
              selector: 'property',
              elementNamePattern: '^(?:id|name)$',
            },
            {
              type: 'natural',
              groupName: 'property',
              selector: 'property',
            },
            {
              groupName: 'bottom-property',
              selector: 'property',
              elementNamePattern: 'At',
            },
          ],
        }),
      ],
      'perfectionist/sort-object-types': [
        'warn',
        sort({
          groups: ['index-signature', 'top-property', 'property', 'bottom-property'],
          customGroups: [
            {
              groupName: 'top-property',
              selector: 'property',
              elementNamePattern: '^(?:id|name)$',
            },
            {
              type: 'natural',
              groupName: 'property',
              selector: 'property',
            },
            {
              groupName: 'bottom-property',
              selector: 'property',
              elementNamePattern: 'At',
            },
          ],
        }),
      ],
      'perfectionist/sort-interfaces': [
        'warn',
        sort({
          groups: ['index-signature', 'top-property', 'property', 'bottom-property'],
          customGroups: [
            {
              groupName: 'top-property',
              selector: 'property',
              elementNamePattern: '^(?:id|name)$',
            },
            {
              type: 'natural',
              groupName: 'property',
              selector: 'property',
            },
            {
              groupName: 'bottom-property',
              selector: 'property',
              elementNamePattern: 'At',
            },
          ],
        }),
      ],
      'perfectionist/sort-maps': 'warn',
      'perfectionist/sort-sets': 'warn',
      'perfectionist/sort-switch-case': 'warn',
      'perfectionist/sort-variable-declarations': 'warn',
      'perfectionist/sort-jsx-props': 'warn',
      'perfectionist/sort-union-types': [
        'warn',
        {
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
        'warn',
        {
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
    },
  },
];

export default config;
