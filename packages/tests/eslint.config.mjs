import eslint from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import prettierConfig from "eslint-config-prettier/flat"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
	globalIgnores(["playwright-report/**", "test-results/**"]),
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: globals.node
		}
	},
	prettierConfig
])
