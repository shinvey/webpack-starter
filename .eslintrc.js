module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'standard',
  // define some global variables. See https://eslint.org/docs/user-guide/configuring#specifying-globals
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    // env is injected by webpack define plugin. See webpack.config.js
    'env': 'readonly'
  },
  // babel-eslint see https://github.com/babel/babel-eslint
  'parser': "babel-eslint",
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'rules': {
    'no-return-assign': 'off'
  }
}
