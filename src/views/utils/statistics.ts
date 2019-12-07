/**
 * 数据统计
 * @param page  当前页面
 * @param Details 具体内容
 */
export function trackEvent(page, Details) {
  try {
    // 预配置代码
    const _czc = (window as any)._czc || []
    _czc.push(['_trackPageview', location.pathname, document.location.href])
    _czc.push(['_trackEvent', page, Details])
  } catch (error) {
    console.error(error)
  }
}
