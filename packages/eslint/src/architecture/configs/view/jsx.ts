import { Linter } from 'eslint';
import createNoRestrictedSyntax from 'eslint-no-restricted/syntax';
import base from '../base.js';

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
    message: 'Binary expressions are not allowed.',
    name: 'no-binary-expressions',
    selector: 'BinaryExpression',
    docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
  },
  {
    message: 'Only one function can be exported.',
    name: 'only-one-function-export',
    selector: 'ExportNamedDeclaration ~ ExportNamedDeclaration',
    docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
  }
);

export default [...base, noRestrictedSyntax.configs.recommended] as Linter.Config[];
