import eslint from '@eslint/js'
import pluginVitest from '@vitest/eslint-plugin'
import configPrettier from 'eslint-config-prettier'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginUnicorn from 'eslint-plugin-unicorn'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import typescriptEslint from 'typescript-eslint'
import globals from 'globals'
import pluginPreferArrowFunction from 'eslint-plugin-prefer-arrow-functions'

const GLOB_ALL = ['**/*.{js,ts,tsx,mjs}']
const GLOB_JS = ['**/*.{js,cjs,mjs}']
const GLOB_TS = ['**/*.{ts,tsx}']

const unicorn = typescriptEslint.config(
  {
    files: GLOB_ALL,
    ...pluginUnicorn.configs['flat/recommended'],
  },
  {
    rules: {
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  }
)

const javascript = typescriptEslint.config(
  {
    files: GLOB_ALL,
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    name: 'javascript',
    rules: eslint.configs.recommended.rules,
  },
  {
    files: GLOB_ALL,
    name: 'prefer-arrow-function',
    plugins: {
      'prefer-arrow-functions': pluginPreferArrowFunction,
    },
    rules: {
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        { disallowPrototype: true, singleReturnOnly: false },
      ],
    },
  }
)

const test = typescriptEslint.config({
  files: ['**/*.test.ts'],
  name: 'vitest',
  plugins: { vitest: pluginVitest },
  rules: {
    ...pluginVitest.configs.recommended.rules,
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    // https://typescript-eslint.io/rules/unbound-method/
    '@typescript-eslint/unbound-method': 'off',
  },
})

const typescript = typescriptEslint.config(
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
        },
      ],
      // Enable when codebase is ready
      '@typescript-eslint/no-explicit-any': 'warn',
      // https://typescript-eslint.io/rules/no-misused-promises/#checksvoidreturn
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      // Warn until we fix discuss about it
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowBoolean: true,
          allowNumber: true,
        },
      ],
    },
  }
)

const jsDoc = typescriptEslint.config(
  {
    ...pluginJsdoc.configs['flat/contents-typescript-error'],
    files: GLOB_TS,
  },
  {
    ...pluginJsdoc.configs['flat/logical-typescript-error'],
    files: GLOB_TS,
  },
  {
    ...pluginJsdoc.configs['flat/stylistic-typescript-error'],
    files: GLOB_TS,
  },
  {
    ...pluginJsdoc.configs['flat/recommended-error'],
    files: GLOB_JS,
  },
  {
    rules: {
      'jsdoc/lines-before-block': 'off',
      'jsdoc/require-hyphen-before-param-description': 'error',
      'jsdoc/require-jsdoc': 'off',
    },
  }
)

const ignored = typescriptEslint.config({
  ignores: [
    '**/dist',
    '**/build',
    '**/node_modules',
    '**/coverage',
    '**/reports',
    '**/*.cjs',
    '**/tree.gen.ts',
    '**/.astro',
  ],
  name: 'ignored',
})

// https://typescript-eslint.io/users/configs#disable-type-checked
// Must be after typescript eslint config
const disabledTypecheck = typescriptEslint.config({
  files: ['**/*.{js,cjs,mjs}'],
  ...typescriptEslint.configs.disableTypeChecked,
})

const typescriptParser = {
  languageOptions: {
    parserOptions: {
      // https://typescript-eslint.io/blog/announcing-typescript-eslint-v8-beta#project-service
      // For faster linting
      projectService: {
        allowDefaultProject: ['*.js'],
      },
    },
  },
}

const unusedImports = typescriptEslint.config({
  plugins: {
    'unused-imports': pluginUnusedImports,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
})

export default typescriptEslint.config(
  ...javascript,
  ...typescript,
  ...unicorn,
  ...test,
  ...ignored,
  ...unusedImports,
  ...jsDoc,
  typescriptParser,
  configPrettier,
  ...disabledTypecheck
)
