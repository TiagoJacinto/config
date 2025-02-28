import { Linter } from 'eslint';
import browser from './browser.js';
import javascript from './javascript.js';
import jest from './jest.js';
import node from './node.js';
import base from './nx/base.js';
import enforceModuleBoundaries from './nx/enforceModuleBoundaries.js';
import recommended from './recommended.js';
import sonar from './sonar.js';
import typescript from './typescript.js';
import { ConfigArray } from 'typescript-eslint';
import defaultDepConstraints from './nx/defaultDepConstraints.js';

export const nx = {
  defaultDepConstraints,
};

export default {
  configs: {
    nx: {
      base,
      enforceModuleBoundaries,
    },
    browser,
    javascript,
    jest,
    node,
    recommended,
    sonar,
    typescript: typescript as ConfigArray,
  },
};
