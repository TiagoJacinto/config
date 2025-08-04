import react from "@eslint-react/eslint-plugin";
import type { Linter } from "eslint";
import { config } from "typescript-eslint";
import base from "./base.js";

export default config({
	extends: [base, react.configs["recommended-type-checked"]],
}) as Linter.Config[];
