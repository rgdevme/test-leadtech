import eslint from "@eslint/js"
import prettierConfig from "eslint-config-prettier/flat"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{ ignores: ["dist/**"] }
)
