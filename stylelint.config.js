module.exports = {
  /**
   * npm i -D stylelint stylelint-config-standard
   * stylelint 文档 https://github.com/stylelint/stylelint
   * stylelint-config-standard 文档 https://github.com/stylelint/stylelint-config-standard
   */

  // stylelint-config-standard 默认规则 https://github.com/stylelint/stylelint-config-standard/blob/master/index.js
  'extends': [
    'stylelint-config-standard',
    // Lost grid config for stylelint. See https://github.com/delorge/stylelint-config-lost
    'stylelint-config-lost'
  ],
  plugins: [
    // support scss. See https://github.com/kristerkari/stylelint-scss
    // why doesn't support .sass syntax, see https://github.com/kristerkari/stylelint-scss/issues/104
    // and no plugin especially for .sass file, see https://stylelint.io/user-guide/plugins/
    'stylelint-scss',
    /**
     * This plugin checks if the CSS you're using is supported by the browsers
     * you're targeting. It uses doiuse to detect browser support. Doiuse itself
     * checks your code against the caniuse database and uses browserslist to get
     * the list of browsers you want to support. Doiuse and this plugin are only
     * compatible with standard css syntax, so syntaxes like scss, less and others
     * aren't supported.
     * 对css进行浏览器兼容性检查
     * see https://github.com/ismay/stylelint-no-unsupported-browser-features
     */
    'stylelint-no-unsupported-browser-features'
  ],
  'rules': {
    // especially for scss. See https://github.com/kristerkari/stylelint-config-recommended-scss/blob/master/index.js
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // rules specified from stylelint-no-unsupported-browser-features
    // see https://github.com/ismay/stylelint-no-unsupported-browser-features#recommendations
    'plugin/no-unsupported-browser-features': [true, {
      'severity': 'warning'
    }],

    // add your overrides and additions here.
    // Suggested additions https://github.com/stylelint/stylelint-config-standard#suggested-additions
    'unit-no-unknown': [true, {
      ignoreFunctions: ['image-set']
    }]
  }
}
