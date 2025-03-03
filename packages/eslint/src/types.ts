import { Config } from '@sveltejs/kit';

export type PluginConfig<T> = Partial<T>;
export type PluginOption<T> = boolean | PluginConfig<T>;

export type LanguageOptions = {
  files: string[];
  withProjectService: boolean;
};

export type Options = Partial<{
  ratios: Partial<Record<'refactoring', number>>;
  extensions: Partial<{
    withProjectService: boolean;
  }>;
  plugins: Partial<{
    javascript: PluginOption<LanguageOptions>;
    typescript: PluginOption<LanguageOptions>;
    svelte: PluginOption<LanguageOptions & { svelteConfig: Config }>;
  }>;
}>;
