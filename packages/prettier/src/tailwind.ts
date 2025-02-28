import { Options } from 'prettier';
import base from './base.js';

export default {
  ...base,
  plugins: ['prettier-plugin-tailwindcss'],
} satisfies Options;
