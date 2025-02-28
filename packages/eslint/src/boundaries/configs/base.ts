import { Linter } from 'eslint';
import boundaries from 'eslint-plugin-boundaries';

export default [
  {
    plugins: {
      boundaries,
    },
  },
] satisfies Linter.Config[];
