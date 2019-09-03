const baseURL = 'http://h5.fgry45iy.com'
/**
 * Configuration Management
 * https://github.com/lwsjs/local-web-server/wiki/Configuration-Management
 */
module.exports = {
  /**
   * How to serve a Single Page Application (SPA)
   * https://github.com/lwsjs/local-web-server/wiki/How-to-serve-a-Single-Page-Application-(SPA)
   * SPA首页，/path/to/somewhere 此类路径全部交给index.html来处理
   * 下方的rewrite规则例外
   */
  // spa: 'index.html',
  directory: 'dist', // SPA首页相对位置的目录，dist/index.html
  compress: true, // 启用gzip
  // http2: true, // 启用http2
  rewrite: [
    // 路由规则
    // {
    //   from: '/lib/(.*)',
    //   to: '../resource/lib/$1'
    // },
    // 静态资源访问路径转向规则
    {
      from: '/assets/(.*)',
      to: `${baseURL}/assets/$1`
    },
    // 后端接口访问路径转向规则
    // {
    //   from: '/api/(.*)',
    //   to: `${baseURL}/api/$1`
    // },
    // websocket访问路径转向规则
    // {
    //   from: '/stream/(.*)',
    //   to: `${baseURL}/stream/$1`
    // }
  ]
}
