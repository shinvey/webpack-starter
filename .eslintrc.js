module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'standard',
    // 启用react jsx lint规则
    'plugin:react/recommended'
  ],
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
  'settings': {
    react: {
      // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      version: 'detect'
    }
  },
  'rules': {
    'no-return-assign': 'off',
    'comma-dangle': 'off',
    'react/prop-types': 'off',
  }
}
