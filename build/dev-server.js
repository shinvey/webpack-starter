const upstreamProxyServer = require('./upstream-proxy-server')
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
      /**
       * 设置上层代理
       * https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/corporate-proxy.md
       */
      agent: upstreamProxyServer(),
      changeOrigin: true
      // pathRewrite: {
      //   '^/assets': ''
      // }
    }
  ]
}
