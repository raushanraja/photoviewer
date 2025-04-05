import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import solid from 'eslint-plugin-solid'
import prettierConfig from 'eslint-config-prettier'
import typescriptEslint from '@typescript-eslint/eslint-plugin'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,tsx,jsx'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    plugins: {
      typescriptEslint,
      prettierConfig,
      solid,
    },
    ignores: ['node_modules', 'dist', 'public', 'src-tauri'],
  },
  tseslint.configs.recommended,
])
