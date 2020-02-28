import { createBrowserHistory } from 'history'
export default createBrowserHistory()
/**
 * 可以优先使用hashHistory，让webview在无需搭配url rewrite特性时，
 * 也可以访问路由对应的视图
 *
 * 对于支持url rewrite的web server可以选用browserHistory
 */
/**
 * hybrid应用一般都会在userAgent中声明自己
 * 比如微信webchat、微博weibo、QQ浏览器QQBrowser
 * 如果要使用hashHistory来适配webview，那么就可以通过判断userAgent实现
 * isApp ? hashHistory : browserHistory作为Router history的属性值
 */
// import { createHashHistory, createBrowserHistory } from 'history'
// export default isApp ? createHashHistory() : createBrowserHistory()
