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
import react from './react/index.js';

type Falsy = null | undefined | false | '' | 0 | 0n;

const files = (...extensions: (string | Falsy)[]) =>
  extensions.filter(Boolean).length > 0 ? [`**/*.{${extensions.join(',')}}`] : [];

function mergeOptions(options: Options) {
  const { ratios, extensions, plugins } = mergeDeepLeft(options, defaultOptions);

  return {
    ratios: ratios,
    plugins: {
      javascript: mergePluginOptions({
        plugin: plugins.javascript,
        base: {
          files: files('js', 'mjs', 'cjs'),
          withProjectService: extensions.withProjectService,
        },
      }),
      typescript: mergePluginOptions({
        plugin: plugins.typescript,
        base: {
          files: files('ts', 'mts', 'cts'),
          withProjectService: extensions.withProjectService,
        },
      }),
      svelte: mergePluginOptions<
        LanguageOptions & {
          svelteConfig?: Config;
        }
      >({
        plugin: plugins.svelte,
        base: {
          files: files('svelte', plugins.typescript && 'svelte.ts'),
          withProjectService: extensions.withProjectService,
        },
      }),
      react: mergePluginOptions({
        plugin: plugins.react,
        base: {
          files: files(plugins.javascript && 'jsx', plugins.typescript && 'tsx'),
          withProjectService: extensions.withProjectService,
        },
      }),
    },
  };
}

export default (options: Options = {}) => {
  function mergeOptions(options: Options) {
    const { ratios, extensions, plugins } = mergeDeepLeft(options, defaultOptions);

    return {
      ratios: ratios,
      plugins: {
        javascript: mergePluginOptions({
          plugin: plugins.javascript,
          base: {
            files: files('js', 'mjs', 'cjs'),
            withProjectService: extensions.withProjectService,
          },
        }),
        typescript: mergePluginOptions({
          plugin: plugins.typescript,
          base: {
            files: files('ts', 'mts', 'cts'),
            withProjectService: extensions.withProjectService,
          },
        }),
        svelte: mergePluginOptions<
          LanguageOptions & {
            svelteConfig?: Config;
          }
        >({
          plugin: plugins.svelte,
          base: {
            files: files('svelte', plugins.typescript && 'svelte.ts'),
            withProjectService: extensions.withProjectService,
          },
        }),
        react: mergePluginOptions({
          plugin: plugins.react,
          base: {
            files: files(plugins.javascript && 'jsx', plugins.typescript && 'tsx'),
            withProjectService: extensions.withProjectService,
          },
        }),
      },
    };
  }

  const { plugins, ratios } = mergeOptions(options);

  return [
    ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
    ...sonar({ ratios }),
    {
      files: [
        ...(plugins.javascript?.withProjectService ? plugins.javascript.files : []),
        ...(plugins.typescript?.withProjectService ? plugins.typescript.files : []),
        ...(plugins.svelte?.withProjectService ? plugins.svelte.files : []),
        ...(plugins.react?.withProjectService ? plugins.react.files : []),
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    {
      files: [
        ...(plugins.javascript?.files ?? []),
        ...(plugins.typescript?.files ?? []),
        ...(plugins.svelte?.files ?? []),
        ...(plugins.react?.files ?? []),
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
      pluginConfig: plugins.javascript,
      base: javascript,
    }),
    ...resolveLanguagePlugin({
      pluginConfig: plugins.typescript,
      base: typescript as Linter.Config[],
    }),
    ...resolveLanguagePlugin({
      pluginConfig: plugins.svelte,
      base: svelte.configs.base,
      configure(config, options) {
        if (options.withProjectService)
          config = [...config, ...svelte.extensions.withProjectService(options.svelteConfig)];

        return config;
      },
    }),
    ...resolveLanguagePlugin({
      pluginConfig: plugins.react,
      base: react.configs.base,
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
