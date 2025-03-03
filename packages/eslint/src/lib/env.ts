import { packageExists } from './utils.js';

export const isPrettierAvailable =
  packageExists('prettier') && packageExists('eslint-config-prettier');
