pnpm create vite@latest ui --template solid-ts
cd ui
pnpm i -D tailwindcss@latest @tailwindcss/vite@latest daisyui@latest eslint globals @eslint/js typescript-eslint prettier eslint-plugin-solid eslint-config-prettier prettier-plugin-tailwindcss @typescript-eslint/eslint-plugin

# update the vite.config.js to import tailwindcss
sed -i "s/^\(import { defineConfig \} from 'vite'\)/\1\nimport tailwindcss from '@tailwindcss\/vite'/" vite.config.ts
# Add tailwindcss to the plugins array   plugins: [solid()],
sed -i 's/^\(  plugins: \[\)/\1tailwindcss(),/' vite.config.ts

# Replace src/index.css and include
# ```
# @import "tailwindcss"
# @plugin "daisyui"
# ```

rm src/index.css
echo "@import \"tailwindcss\";" >src/index.css
echo "@plugin \"daisyui\";" >>src/index.css

# Install Prettier dependencies

# Create Prettier configuration file
echo "{}" >.prettierrc.json

# Modify .prettierrc.json
echo '{' >.prettierrc.json
echo '  "semi": false,' >>.prettierrc.json
echo '  "singleQuote": true,' >>.prettierrc.json
echo '  "trailingComma": "all",' >>.prettierrc.json
echo '  "plugins": ["prettier-plugin-tailwindcss"]' >>.prettierrc.json
echo '}' >>.prettierrc.json

# Define the content of eslint.config.js
eslint_config_content="
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
"
echo "$eslint_config_content" >eslint.config.js
echo "eslint.config.js has been created/updated."

# 4. Add lint and format scripts to package.json
sed -i 's/"dev": "vite"/"dev": "vite",\n    "lint": "eslint . --ext .ts,.tsx",\n    "format": "prettier --write ."/' package.json

# 5.  Modify tsconfig.json so that eslint does not flag errors in components
sed -i 's/"jsx": "preserve"/"jsx": "preserve",\n    "jsxImportSource": "solid-js"/' tsconfig.json

# 6. Remove deprecated .eslintignore creation
rm -f .eslintignore

# 7. (Optional)  Example usage, format and lint the code
pnpm format
pnpm lint
