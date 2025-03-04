import { Config } from '@sveltejs/kit';
import { Linter } from 'eslint';
import { Simplify } from 'type-fest';

export type PluginConfig<T> = Partial<T>;
export type PluginOption<T> = boolean | PluginConfig<T>;

export type LanguageOptions = {
  files: string[];
  withProjectService: boolean;
};

export type Options = Simplify<
  Partial<{
    ratios: Partial<Record<'refactoring', number>>;
    extensions: Partial<{
      withProjectService: boolean;
    }>;
    plugins: Partial<{
      languages: Partial<{
        javascript: PluginOption<LanguageOptions>;
        typescript: PluginOption<LanguageOptions>;
        svelte: PluginOption<LanguageOptions & { svelteConfig: Config }>;
        react: PluginOption<LanguageOptions>;
      }>;
    }>;
  }>
>;
