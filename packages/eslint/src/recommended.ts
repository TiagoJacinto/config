import {
  LanguagePluginOptions,
  Options,
  PluginConfig,
  PluginOption,
  PluginOptions,
} from './types.js';
import { mergeDeepLeft } from 'ramda';
import sonar from './sonar.js';
import javascript from './javascript.js';
import typescript from './typescript.js';
import defaultOptions from './defaultOptions.js';
import type { Linter } from 'eslint';
import { isBiomeAvailable, isPrettierAvailable } from './lib/env.js';
import svelte from './svelte/index.js';
import { Config } from '@sveltejs/kit';
import react from './react/index.js';
import perfectionist from './perfectionist/index.js';
import jest from './jest.js';

type Falsy = null | undefined | false | '' | 0 | 0n;

const files = (...extensions: (string | Falsy)[]) =>
  extensions.filter(Boolean).length > 0 ? [`**/*.{${extensions.join(',')}}`] : [];

export default (options: Options) => {
  function mergeOptions() {
    const { ratios, runtimeEnvironment, extensions, plugins } = mergeDeepLeft(
      options,
      defaultOptions,
    );

    const javascriptPluginOptions = mergePluginOptions({
      plugin: plugins.languages.javascript,
      base: {
        files: files('js', 'mjs', 'cjs', plugins.languages.react && 'jsx'),
        withProjectService: extensions.withProjectService,
      },
    });

    const typescriptPluginOptions = mergePluginOptions({
      plugin: plugins.languages.typescript,
      base: {
        files: files('ts', 'mts', 'cts', plugins.languages.react && 'tsx'),
        withProjectService: extensions.withProjectService,
      },
    });

    const sveltePluginOptions = mergePluginOptions<
      LanguagePluginOptions & {
        svelteConfig?: Config;
      }
    >({
      plugin: plugins.languages.svelte,
      base: {
        files: files('svelte', plugins.languages.typescript && 'svelte.ts'),
        withProjectService: extensions.withProjectService,
      },
    });

    const reactPluginOptions = mergePluginOptions({
      plugin: plugins.languages.react,
      base: {
        files: files(plugins.languages.javascript && 'jsx', plugins.languages.typescript && 'tsx'),
        withProjectService: extensions.withProjectService,
      },
    });

    return {
      ratios,
      runtimeEnvironment,
      plugins: {
        perfectionist: mergePluginOptions({
          plugin: plugins.formatting.perfectionist,
          base: {
            files: [
              ...(javascriptPluginOptions?.files ?? []),
              ...(typescriptPluginOptions?.files ?? []),
              ...(sveltePluginOptions?.files ?? []),
              ...(reactPluginOptions?.files ?? []),
            ],
          },
        }),
        jest: mergePluginOptions({
          plugin: plugins.testing.jest,
          base: {
            files: files('tests/**/*'),
          },
        }),
        turbo: mergePluginOptions({
          plugin: plugins.build.turbo,
          base: {},
        }),
        next: mergePluginOptions({
          plugin: plugins.frameworks.next,
          base: {
            files: [
              ...(javascriptPluginOptions?.files ?? []),
              ...(typescriptPluginOptions?.files ?? []),
              ...(reactPluginOptions?.files ?? []),
            ],
          },
        }),
        javascript: javascriptPluginOptions,
        typescript: typescriptPluginOptions,
        svelte: sveltePluginOptions,
        react: reactPluginOptions,
      },
    };
  }

  const { plugins, runtimeEnvironment, ratios } = mergeOptions();

  return [
    ...(isPrettierAvailable ? [require('eslint-config-prettier')] : []),
    ...(isBiomeAvailable ? [require('eslint-config-biome')] : []),
    ...sonar({ ratios }),
    {
      files: [
        ...((plugins.javascript?.withProjectService ? plugins.javascript.files : []) ?? []),
        ...((plugins.typescript?.withProjectService ? plugins.typescript.files : []) ?? []),
        ...((plugins.svelte?.withProjectService ? plugins.svelte.files : []) ?? []),
        ...((plugins.react?.withProjectService ? plugins.react.files : []) ?? []),
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
        },
      },
    },
    ...resolvePlugin({
      pluginConfig: plugins.perfectionist,
      base: perfectionist.configs.recommended({ environment: runtimeEnvironment }),
    }),
    ...resolvePlugin({
      pluginConfig: plugins.javascript,
      base: javascript,
    }),
    ...resolvePlugin({
      pluginConfig: plugins.typescript,
      base: typescript as Linter.Config[],
    }),
    ...resolvePlugin({
      pluginConfig: plugins.svelte,
      base: svelte.configs.base,
      configure(config, options) {
        if (options.withProjectService)
          config = [...config, ...svelte.extensions.withProjectService(options.svelteConfig)];

        return config;
      },
    }),
    ...resolvePlugin({
      pluginConfig: plugins.react,
      base: react.configs.base,
    }),
    ...resolvePlugin({
      pluginConfig: plugins.jest,
      base: jest,
    }),
  ] satisfies Linter.Config[];
};

function mergePluginOptions<T extends PluginOptions>({
  plugin,
  base,
}: {
  plugin: PluginOption<T>;
  base?: T;
}) {
  if (!plugin || !base) return null;

  if (typeof plugin === 'boolean') return base;

  return mergeDeepLeft(plugin, base) as unknown as T;
}

function resolvePlugin<T extends PluginOptions>({
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
