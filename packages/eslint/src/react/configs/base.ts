import { Linter } from 'eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from '@eslint-react/eslint-plugin';
import pluginReact from 'eslint-plugin-react';

const config: Linter.Config[] = [
  react.configs['recommended'] as unknown as Linter.Config,
  {
    settings: { react: { version: 'detect' } },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    languageOptions: pluginReact.configs.flat.recommended!.languageOptions,
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'sonarjs/no-nested-functions': [
        'error',
        {
          threshold: 7,
        },
      ],
    },
  },
];

export default config;
