import { Linter } from 'eslint';
import functional from 'eslint-plugin-functional';
import createNoRestrictedSyntax from 'eslint-no-restricted/syntax';

const functionSelectors = ['FunctionDeclaration', 'ArrowFunctionExpression'];

const noRestrictedSyntax = createNoRestrictedSyntax(
  {
    message: 'Variable declarations are not allowed inside functions.',
    name: 'no-inner-variables',
    selector: [
      ...functionSelectors.map((d) => `${d} VariableDeclaration`),
      ...functionSelectors.map((d) => `${d} ArrowFunctionExpression`),
    ],
    docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
  },
  {
    message: 'Logic is not allowed inside functions.',
    name: 'no-inner-logic',
    selector: functionSelectors.map((d) => `${d} BinaryExpression`),
    docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
  },
  {
    message: 'Only one function can be exported.',
    name: 'only-one-function-export',
    selector: 'ExportNamedDeclaration ~ ExportNamedDeclaration',
    docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
  }
);

export default <Linter.Config[]>[
  functional.configs.off,
  noRestrictedSyntax.configs.recommended,
  {
    rules: {
      'functional/no-loop-statements': 'error',
      'functional/prefer-property-signatures': [
        'error',
        {
          ignoreIfReadonlyWrapped: true,
        },
      ],
    },
  },
];
