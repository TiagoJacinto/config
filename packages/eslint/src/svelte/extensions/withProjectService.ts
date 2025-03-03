import { Linter } from 'eslint';
import tslint from 'typescript-eslint';
import { Config } from '@sveltejs/kit';

export default (svelteConfig?: Config) =>
  [
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: ['.svelte'],
          parser: tslint.parser,
          svelteConfig,
        },
      },
    },
  ] as Linter.Config[];
