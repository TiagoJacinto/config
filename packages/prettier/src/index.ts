import { Config } from 'prettier';
import base from './configs/base.js';
import svelte from './configs/svelte.js';
import tailwind from './configs/tailwind.js';
import { reduce, mergeDeepWith, concat } from 'ramda';

const config = (...configs: Config[]) =>
  reduce<Config, Config>(
    mergeDeepWith((l, r) => (Array.isArray(l) && Array.isArray(r) ? concat(l, r) : l)),
    {}
  )(configs);

const configs = {
  base,
  svelte,
  tailwind,
};

export { config, configs };
export default {
  config,
  configs,
};
