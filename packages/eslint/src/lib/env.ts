import { packageExists } from './utils.js';

export const isPrettierAvailable =
  packageExists('prettier')

export const isBiomeAvailable =
  packageExists('@biomejs/biome')
