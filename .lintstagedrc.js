export default {
  '*': 'prettier --ignore-unknown --write',
  '*.ts': 'eslint --fix',
  '*.md': 'markdownlint --fix',
}
