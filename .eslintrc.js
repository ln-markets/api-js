module.exports = {
  extends: ['standard', 'prettier'],
  plugins: ['import', 'prettier'],
  env: {
    node: true,
  },
  rules: {
    'space-before-function-paren': 0,
    'new-cap': 0,
    'prettier/prettier': 2,
    camelcase: 0,
  },
}
