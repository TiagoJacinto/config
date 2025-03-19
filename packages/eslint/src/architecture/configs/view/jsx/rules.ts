const functionSelectors = ['FunctionDeclaration', 'ArrowFunctionExpression'].map(
  (f) => `JSXAttribute ${f}`
);

export const noInnerVariablesInJSXAtrributeFunctions = {
  message: 'Variable declarations are not allowed inside JSX attribute functions.',
  name: 'no-inner-variables-in-jsx-attribute-functions',
  selector: [
    ...functionSelectors.map((d) => `${d} VariableDeclaration`),
    ...functionSelectors.map((d) => `${d} FunctionDeclaration`),
  ],
  docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
};

export const noBinaryExpressionsInJSXAttributes = {
  message: 'Binary expressions are not allowed in JSX attributes.',
  name: 'no-binary-expressions-in-jsx-attributes',
  selector: 'JSXAttribute BinaryExpression',
  docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
};

export const onlyOneFunctionExport = {
  message: 'Only one function can be exported.',
  name: 'only-one-function-export',
  selector: 'ExportNamedDeclaration ~ ExportNamedDeclaration',
  docUrl: 'https://eslint.org/docs/latest/rules/no-restricted-syntax',
};
