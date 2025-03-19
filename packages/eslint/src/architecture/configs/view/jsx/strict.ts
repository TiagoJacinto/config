import { Linter } from 'eslint';
import createNoRestrictedSyntax from 'eslint-no-restricted/syntax';
import base from '../../base.js';
import {
  noInnerVariablesInJSXAtrributeFunctions,
  noBinaryExpressionsInJSXAttributes,
  onlyOneFunctionExport,
} from './rules.js';

const noRestrictedSyntax = createNoRestrictedSyntax(
  noInnerVariablesInJSXAtrributeFunctions,
  noBinaryExpressionsInJSXAttributes,
  onlyOneFunctionExport
);

export default [...base, noRestrictedSyntax.configs.recommended] as Linter.Config[];
