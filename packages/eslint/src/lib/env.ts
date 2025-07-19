import { packageExists } from './utils.js';

export const isPrettierAvailable =
  packageExists('prettier') && packageExists('eslint-config-prettier');

export const isBiomeAvailable =
  packageExists('@biomejs/biome') && packageExists('eslint-config-biome');
