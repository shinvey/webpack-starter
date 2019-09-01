/**
 * @param  {string} ...className
 * 解构react的className数组
 */
export function reactClassNameJoin(...className) {
  return className.join(' ')
}

/**
 * 数据统计
 *
 * @param url  页面路径
 * @param page  当前页面
 * @param Details 具体内容
 */
export function setDataStatistics(url, page, Details) {
  try {
    if ((window as any)._czc) {
      (window as any)._czc.push([
        '_trackPageview',
        url,
        document.location.href
      ]);
      (window as any)._czc.push(['_trackEvent', page, Details])
    }
  } catch (error) {
    console.error(error)
  }
}

export function isJudge(value) {
  return (trued, falsed) => {
    if (value) {
      return trued
    } else {
      return falsed
    }
  }
}
