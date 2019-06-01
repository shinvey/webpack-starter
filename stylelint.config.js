module.exports = {
  /**
   * npm i -D stylelint stylelint-config-standard
   * stylelint 文档 https://github.com/stylelint/stylelint
   * stylelint-config-standard 文档 https://github.com/stylelint/stylelint-config-standard
   */

  // stylelint-config-standard 默认规则 https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
  'extends': 'stylelint-config-standard',
  plugins: [
    // support scss. See https://github.com/kristerkari/stylelint-scss
    // why doesn't support .sass syntax, see https://github.com/kristerkari/stylelint-scss/issues/104
    // and no plugin especially for .sass file, see https://stylelint.io/user-guide/plugins/
    'stylelint-scss'
  ],
  'rules': {
    // especially for scss. See https://github.com/kristerkari/stylelint-config-recommended-scss/blob/master/index.js
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true

    // add your overrides and additions here.
    // Suggested additions https://github.com/stylelint/stylelint-config-standard#suggested-additions
  }
}
