module.exports = {
  '*.{js,jsx}': [
    'eslint --fix',
    'git add'
  ],
  '*.ts': [
    // TSLint command-line interface https://palantir.github.io/tslint/usage/cli/
    'tslint --project tsconfig.json --fix',
    'git add'
  ],
  '*.{css,pcss,scss,sass}': [
    'stylelint --fix',
    'git add'
  ]
}
