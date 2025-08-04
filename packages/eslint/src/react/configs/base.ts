import react from "@eslint-react/eslint-plugin";
import type { Linter } from "eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
	react.configs["recommended"] as unknown as Linter.Config,
	{
		settings: { react: { version: "detect" } },
		plugins: {
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			// React scope no longer necessary with new JSX transform.
			"react/react-in-jsx-scope": "off",
		},
	},
	{
		languageOptions: pluginReact.configs.flat.recommended!.languageOptions,
		rules: {
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"sonarjs/no-nested-functions": [
				"error",
				{
					threshold: 7,
				},
			],
		},
	},
] as const satisfies Linter.Config[];
