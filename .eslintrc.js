module.exports = {
  extends: [
    'plugin:chai-friendly/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:node/recommended',
    'plugin:promise/recommended',
  ],
  ignorePatterns: ['examples/**'],
  env: {
    node: true,
    es2020: true,
    mocha: true,
  },
  globals: {
    module: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'promise/no-callback-in-promise': 'off',
    'space-before-function-paren': 'off',
    'import/no-unresolved': ['error', { commonjs: true }],
    'import/no-extraneous-dependencies': 'error',
    'node/shebang': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'off',
    'no-global-assign': ['error', { exceptions: ['require'] }],
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['redis-mock'],
      },
    ],
    'no-empty': ['error', { allowEmptyCatch: true }],
    camelcase: 'off',
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'require-await': 'error',
    'no-return-await': 'error',
    'no-return-assign': 'error',
    eqeqeq: 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
  },
}
