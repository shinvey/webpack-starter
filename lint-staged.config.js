/**
 * glob syntax https://github.com/isaacs/node-glob#glob-primer
 */
module.exports = {
  '*.js*(x)': [
    'eslint --fix',
    'git add'
  ],
  '*.ts*(x)': [
    // TSLint command-line interface https://palantir.github.io/tslint/usage/cli/
    'tslint --project tsconfig.json --fix',
    'git add'
  ],
  '*.*(p|s|l)+(c|a|e)ss': [
    'stylelint --fix',
    'git add'
  ]
}
