import { Linter } from 'eslint';
import browser from './browser';
import javascript from './javascript';
import jest from './jest';
import node from './node';
import base from './nx/base';
import enforceModuleBoundaries from './nx/enforceModuleBoundaries';
import recommended from './recommended';
import sonar from './sonar';
import typescript from './typescript';
import { ConfigArray } from 'typescript-eslint';
import defaultDepConstraints from './nx/defaultDepConstraints';

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
