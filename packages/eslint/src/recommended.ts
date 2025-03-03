import { LanguageOptions, Options, PluginConfig, PluginOption } from './types.js';
import { map, mergeDeepLeft } from 'ramda';
import sonar from './sonar.js';
import javascript from './javascript.js';
import typescript from './typescript.js';
import defaultOptions from './defaultOptions.js';
import type { Linter } from 'eslint';
import importHelpers from 'eslint-plugin-import-helpers';
import { isPrettierAvailable } from './lib/env.js';
import svelte from './svelte/index.js';
import { Config } from '@sveltejs/kit';

export default (options: Options = {}) => {
  const mergedUserOptions = mergeDeepLeft(options, defaultOptions);

  const mergedOptions = {
    ratios: mergedUserOptions.ratios,
    plugins: {
      javascript: mergePluginOptions({
        plugin: mergedUserOptions.plugins.javascript,
        base: {
          files: ['**/*.{js,mjs,cjs,jsx}'],
          withProjectService: mergedUserOptions.extensions.withProjectService,
        },
      }),
      typescript: mergePluginOptions({
        plugin: mergedUserOptions.plugins.typescript,
        base: {
          files: ['**/*.{ts,mts,cts,tsx}'],
          withProjectService: mergedUserOptions.extensions.withProjectService,
        },
      }),
      svelte: mergePluginOptions<
        LanguageOptions & {
          svelteConfig?: Config;
        }
      >({
        plugin: mergedUserOptions.plugins.svelte,
        base: {
          files: ['**/*.{svelte,svelte.ts}'],
          withProjectService: mergedUserOptions.extensions.withProjectService,
        },
      }),
    },
  };

  return [
    ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
    ...sonar(mergedOptions),
    {
      files: [
        ...(mergedOptions.plugins.javascript?.withProjectService
          ? mergedOptions.plugins.javascript.files
          : []),
        ...(mergedOptions.plugins.typescript?.withProjectService
          ? mergedOptions.plugins.typescript.files
          : []),
        ...(mergedOptions.plugins.svelte?.withProjectService
          ? mergedOptions.plugins.svelte.files
          : []),
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      files: [
        ...(mergedOptions.plugins.javascript?.files ?? []),
        ...(mergedOptions.plugins.typescript?.files ?? []),
        ...(mergedOptions.plugins.svelte?.files ?? []),
      ],
      plugins: {
        'import-helpers': importHelpers,
      },
      rules: {
        'import-helpers/order-imports': [
          'warn',
          {
            newlinesBetween: 'always',
            groups: ['module', ['parent', 'sibling'], 'index'],
            alphabetize: { order: 'asc', ignoreCase: true },
          },
        ],
      },
    },
    ...resolveLanguagePlugin({
      pluginConfig: mergedOptions.plugins.javascript,
      base: javascript,
    }),
    ...resolveLanguagePlugin({
      pluginConfig: mergedOptions.plugins.typescript,
      base: typescript as Linter.Config[],
    }),
    ...resolveLanguagePlugin({
      pluginConfig: mergedOptions.plugins.svelte,
      base: svelte.configs.base,
      configure(config, options) {
        if (options.withProjectService)
          config = [...config, ...svelte.extensions.withProjectService(options.svelteConfig)];

        return config;
      },
    }),
  ] satisfies Linter.Config[];
};

function mergePluginOptions<T extends object>({
  plugin,
  base,
}: {
  plugin: PluginOption<T>;
  base: T;
}) {
  if (!plugin) return null;

  if (typeof plugin === 'boolean') return base;

  return mergeDeepLeft(plugin, base) as unknown as T;
}

function resolveLanguagePlugin<T extends LanguageOptions>({
  pluginConfig,
  base,
  configure,
}: {
  pluginConfig: PluginConfig<T> | null;
  base: Linter.Config[];
  configure?: (config: Linter.Config[], options: PluginConfig<T>) => Linter.Config[];
}) {
  if (!pluginConfig) return [];

  if (configure) base = configure(base, pluginConfig);

  return base.map((c) => ({
    ...c,
    files: pluginConfig.files,
  }));
}
