module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard',
    /**
     * eslint-config-prettier is a config that disables rules that conflict with Prettier.
     * Make sure to put it last in the extends array, so it gets the chance to override other configs.
     * https://prettier.io/docs/en/integrating-with-linters.html#disable-formatting-rules
     * https://github.com/prettier/eslint-config-prettier/blob/master/README.md
     */
    'prettier',
    'prettier/standard',
    'prettier/react'
  ],
  // define some global variables. See https://eslint.org/docs/user-guide/configuring#specifying-globals
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    // env is injected by webpack define plugin. See webpack.config.js
    env: 'readonly'
  },
  // babel-eslint see https://github.com/babel/babel-eslint
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    // consider using eslint-plugin-babel if you would like to support experimental features
    /**
     * eslint-plugin-prettier is a plugin that adds a rule that formats content
     * using Prettier. Add it to your devDependencies, then enable the plugin and rule.
     * https://prettier.io/docs/en/integrating-with-linters.html#use-eslint-to-run-prettier
     * https://github.com/prettier/eslint-plugin-prettier
     */
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error'
  }
}
