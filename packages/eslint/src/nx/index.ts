import base from './configs/base.js';
import defaultDepConstraints from './constants/defaultDepConstraints.js';
import withModuleBoundaries from './extensions/withModuleBoundaries.js';

export default {
  configs: {
    base,
  },
  constants: {
    defaultDepConstraints,
  },
  extensions: {
    withModuleBoundaries,
  },
};
