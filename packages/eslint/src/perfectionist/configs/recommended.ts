import { Linter } from 'eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import { RequireOneOrNone } from 'type-fest';
import { withNewlinesBetween } from '../utils/withNewlinesBetween.js';
import { omit } from 'ramda';

type Options = {
  newlinesBetween?: 'ignore' | 'always' | 'never';
  orderBy?: 'alphabetical' | 'natural' | 'line-length' | 'unsorted';
};

type SelectorGroup = Options &
  RequireOneOrNone<
    {
      type: 'selector';
      name: string;
      many: string[];
      custom: {
        [key: string]: unknown;
        name: string;
      };
    },
    'many' | 'custom'
  >;

type GroupOption =
  | string
  | string[]
  | SelectorGroup
  | {
      type: 'custom';
      groups: GroupOption[];
      newlinesBetween: never;
      orderBy?: 'alphabetical' | 'natural' | 'line-length' | 'unsorted';
    }
  | (Options & {
      type: 'custom';
      groups: (string | SelectorGroup)[];
    });

function resolveGroups(options: Options & { groups: GroupOption[] }) {
  type SeparatedGroupOption = GroupOption | { newlinesBetween: Options['newlinesBetween'] };

  const recursive = (groups: SeparatedGroupOption[]) => {
    type Group = string | string[] | { newlinesBetween: Options['newlinesBetween'] };
    const result: Group[] = [];

    for (const group of groups) {
      if (typeof group === 'string' || !('type' in group) || Array.isArray(group)) {
        result.push(group);
        continue;
      }

      if (group.type === 'selector') {
        if (group.many) {
          result.push(...withNewlinesBetween(group.many, group.newlinesBetween ?? 'ignore'));
          continue;
        }

        result.push(group.custom ? group.custom.name : group.name);
        continue;
      }

      if (group.type === 'custom') {
        result.push(...recursive(group.groups));
      }
    }

    return result;
  };

  return recursive(withNewlinesBetween(options.groups, options.newlinesBetween));
}

function resolveCustomGroups(customGroups: GroupOption[]) {
  type CustomGroup = {
    type?: 'alphabetical' | 'natural' | 'line-length' | 'unsorted';
    groupName: string;
    selector: string;
    elementNamePattern?: string;
  };

  const result: CustomGroup[] = [];

  for (const group of customGroups) {
    if (typeof group === 'string' || Array.isArray(group)) continue;

    if (group.type === 'selector') {
      if (group.many) {
        group.many.forEach((name) => {
          result.push({
            type: group.orderBy,
            selector: group.name,
            groupName: name,
            elementNamePattern: `^${name}$`,
          });
        });
        continue;
      }

      if (group.custom) {
        result.push({
          ...omit(['name'], group.custom),
          type: group.orderBy,
          selector: group.name,
          groupName: group.custom.name,
        });
      }

      if (!group.orderBy) continue;

      result.push({
        type: group.orderBy,
        selector: group.name,
        groupName: group.name,
      });
      continue;
    }

    result.push(...resolveCustomGroups(group.groups));
  }

  return result;
}

const sort = ({
  newlinesBetween,
  groups,
  orderBy,
  ...rest
}: Options & {
  groups?: GroupOption[];
  [k: string]: unknown;
}) => {
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

  return {
    ...rest,
    type: orderBy,
    groups:
      groups &&
      resolveGroups({
        groups,
        newlinesBetween,
      }),
    customGroups: groups && resolveCustomGroups(groups),
  };
};

// const activate = false;

// const test = sortByPriority({

//   newlinesBetween: 'always',
//   groups: [
//     {
//       type: 'selector',
//       name: 'property',
//       orderBy: 'natural',
//     },
//     // 'property',
//     ...((activate
//       ? [
//           {
//             type: 'selector',
//             name: 'method',
//             many: ['hello', 'world', 'tiago'],
//           },
//           {
//             type: 'selector',
//             name: 'method',
//             many: ['hello1', 'world1', 'tiago1'],
//           },
//           {
//             type: 'custom',
//             groups: [
//               {
//                 type: 'custom',
//                 groups: [
//                   {
//                     type: 'custom',
//                     groups: [
//                       {
//                         type: 'selector',
//                         name: 'method',
//                         many: ['nested', 'nested2'],
//                         newlinesBetween: 'never',
//                       },
//                     ],
//                     newlinesBetween: 'never',
//                   },
//                 ],
//                 newlinesBetween: 'never',
//               },
//             ],
//             newlinesBetween: 'never',
//           },
//         ]
//       : []) as GroupOption[]),
//   ],
// });

// console.dir(
//   sort({
//     newlinesBetween: 'always',
//     groups: [
//       'index-signature',
//       {
//         type: 'selector',
//         name: 'property',
//         custom: {
//           name: 'top-property',
//           elementNamePattern: '^(?:id|name)$',
//         },
//       },
//       'property',
//       {
//         type: 'selector',
//         name: 'property',
//         custom: {
//           name: 'bottom-property',
//           elementNamePattern: 'At',
//         },
//       },
//     ],
//   }),
//   {
//     depth: Infinity,
//   }
// );

const config = (environment: string): Linter.Config[] => [
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
      'perfectionist/sort-array-includes': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-classes': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-decorators': ['warn'],
      'perfectionist/sort-enums': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-imports': [
        'warn',
        {
          newlinesBetween: 'always',
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
          newlinesBetween: 'always',
          groups: [
            {
              type: 'selector',
              name: 'property',
              orderBy: 'natural',
            },
          ],
        }),
      ],
      'perfectionist/sort-interfaces': [
        'warn',
        sort({
          newlinesBetween: 'always',
          groups: [
            'index-signature',
            {
              type: 'selector',
              name: 'property',
              custom: {
                name: 'top-property',
                elementNamePattern: '^(?:id|name)$',
              },
            },
            'property',
            {
              type: 'selector',
              name: 'property',
              custom: {
                name: 'bottom-property',
                elementNamePattern: 'At',
              },
            },
          ],
        }),
      ],
      'perfectionist/sort-object-types': [
        'warn',
        sort({
          newlinesBetween: 'always',
          groups: [
            'index-signature',
            {
              type: 'selector',
              name: 'property',
              custom: {
                name: 'top-property',
                elementNamePattern: '^(?:id|name)$',
              },
            },
            'property',
            {
              type: 'selector',
              name: 'property',
              custom: {
                name: 'bottom-property',
                elementNamePattern: 'At',
              },
            },
          ],
        }),
      ],
      'perfectionist/sort-modules': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-maps': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-sets': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-switch-case': ['warn'],
      'perfectionist/sort-variable-declarations': ['warn'],
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-union-types': [
        'warn',
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
        'warn',
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
    },
  },
];

export default config;
