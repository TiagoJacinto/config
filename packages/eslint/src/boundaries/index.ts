import recommended from './configs/recommended.js';
import strict from './configs/strict.js';
import base from './configs/base.js';
import withTypescript from './extensions/withTypescript.js';
import withOptions from './extensions/withOptions.js';

export default {
  configs: {
    base,
    recommended,
    strict,
  },
  extensions: {
    withTypescript,
    withOptions,
  },
};
