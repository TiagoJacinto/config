import { Linter } from 'eslint';
import browser from './browser.js';
import javascript from './javascript.js';
import jest from './jest.js';
import node from './node.js';
import nx from './nx/index.js';
import recommended from './recommended.js';
import sonar from './sonar.js';
import typescript from './typescript.js';
import { ConfigArray } from 'typescript-eslint';
import boundaries from './boundaries/index.js';

export default {
  nx,
  boundaries,
  configs: {
    browser,
    javascript,
    jest,
    node,
    recommended,
    sonar,
    typescript: typescript as ConfigArray,
  },
};
