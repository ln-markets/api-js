const typescript = {
  files: ['*.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `${__dirname}/tsconfig.eslint.json`,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
      node: {
        project: ['tsconfig.json'],
      },
    },
  },
}

module.exports = {
  env: { es2022: true, node: true },
  overrides: [typescript],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'prettier',
  ],
  plugins: ['import'],
  rules: {
    'no-console': 'error',
    'promise/no-callback-in-promise': 'off',
    'space-before-function-paren': 'off',
    'import/no-unresolved': ['error', { commonjs: true }],
    'import/no-extraneous-dependencies': 'error',
    'no-global-assign': ['error', { exceptions: ['require'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    camelcase: 'off',
    'require-await': 'error',
    'no-return-await': 'error',
    'no-return-assign': 'error',
    eqeqeq: 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
  },
}
