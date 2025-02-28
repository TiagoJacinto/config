import base from './base.mjs';

/** @satisfies {import('prettier').Options} */
const config = {
  ...base,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
