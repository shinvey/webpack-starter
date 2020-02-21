/**
 * 开发服务器配置
 * 更多配置选项 https://webpack.js.org/configuration/dev-server/
 */
module.exports = {
  port: 8080,
  proxy: [
    {
      context: [
        '/assets'
      ],
      target: 'http://www.example.com',
      changeOrigin: true
      // pathRewrite: {
      //   '^/assets': ''
      // }
    }
  ]
}
