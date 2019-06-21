module.exports = {
  '*.{js,jsx}': [
    'eslint --fix',
    'git add'
  ],
  '*.{css,pcss,scss,sass}': [
    'stylelint --fix',
    'git add'
  ]
}
