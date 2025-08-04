import type { Linter } from "eslint";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
	{
		plugins: {
			"react-refresh": reactRefresh,
		},
		rules: {
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
] as Linter.Config[];
