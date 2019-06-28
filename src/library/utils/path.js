
/**
 * 相对路径解析
 * @param file
 * @returns {string}
 */
export function resolve (file) {
  return window.location.origin + window.location.pathname.replace(/[\d_\-\w]+\.html$/i, '') + file
}
