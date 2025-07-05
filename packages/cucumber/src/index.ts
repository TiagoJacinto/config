import configs from './configs/index.js';
import merge from 'deepmerge';

const config = (...configs: object[]) => merge.all(configs);

export { config, configs };
export default {
  config,
  configs,
};
