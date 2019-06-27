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
  // js、jsx文件格式是为了支持styled-components
  '*.{css,pcss,scss,sass,js,jsx}': [
    'stylelint --fix',
    'git add'
  ]
}
