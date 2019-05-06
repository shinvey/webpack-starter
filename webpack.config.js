const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    home: './src/pages/home/index.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/pages/home/index.html",
    }),
  ],
};
