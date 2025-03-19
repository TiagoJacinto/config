import { Config } from 'prettier';
import configs from './configs/index.js';
import { reduce, mergeDeepWith, concat } from 'ramda';

const config = (...configs: Config[]) =>
  reduce<Config, Config>(
    mergeDeepWith((left, right) =>
      Array.isArray(left) && Array.isArray(right) ? concat(left, right) : left
    ),
    {}
  )(configs);

export { config, configs };
export default {
  config,
  configs,
};
