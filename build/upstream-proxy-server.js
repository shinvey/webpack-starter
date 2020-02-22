const HttpsProxyAgent = require('https-proxy-agent')
/**
 * 返回http proxy代理对象
 * 默认读取系统环境变量的HTTPS_PROXY or HTTP_PROXY
 * @param proxyServer
 * @returns {*|string|(createHttpsProxyAgent | HttpsProxyAgent)}
 */
module.exports = function upstreamProxyServer (proxyServer) {
  proxyServer = proxyServer || process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  return proxyServer && new HttpsProxyAgent(proxyServer)
}
