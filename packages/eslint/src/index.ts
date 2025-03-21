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
import architecture from './architecture/index.js';
import perfectionist from './perfectionist/index.js';
import react from './react/index.js';
import svelte from './svelte/index.js';

const configs = {
  browser,
  javascript,
  jest,
  node,
  recommended,
  sonar,
  typescript: typescript as ConfigArray,
};

export { architecture, boundaries, nx, perfectionist, react, svelte, configs };
export default {
  architecture,
  boundaries,
  nx,
  perfectionist,
  react,
  svelte,
  configs,
};
