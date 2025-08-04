import { Config } from '@sveltejs/kit';

export type PluginConfig<T extends PluginOptions> = Partial<T>;
export type PluginOption<T extends PluginOptions = PluginOptions> = boolean | PluginConfig<T>;

export type PluginOptions = {
  files?: string[];
};

export type LanguageOptions = {
  withProjectService: boolean;
};

export type LanguagePluginOptions = LanguageOptions & PluginOptions;

export type Options = Partial<{
  runtimeEnvironment: string;
  ratios: Partial<Record<'refactoring', number>>;
  extensions: Partial<{
    with: Partial<Record<"projectService" | "prettier" | "biome", boolean>>
  }>;
  plugins: Partial<{
    formatting: Partial<{
      perfectionist: PluginOption;
    }>;
    languages: Partial<{
      javascript: PluginOption<LanguagePluginOptions>;
      typescript: PluginOption<LanguagePluginOptions>;
      svelte: PluginOption<LanguagePluginOptions & { svelteConfig: Config }>;
      react: PluginOption<LanguagePluginOptions & { with: Partial<Record<"fastRefresh", boolean>> }>;
    }>;
    testing: Partial<{
      jest: PluginOption;
    }>;
    build: Partial<{
      turbo: PluginOption;
    }>;
    frameworks: Partial<{
      next: PluginOption;
    }>;
  }>;
}>;
