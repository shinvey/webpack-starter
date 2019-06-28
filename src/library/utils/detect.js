export function platform () {
  const ua = navigator.userAgent
  let name = 'unknown'
  if (/ip(hone|ad|od)/i.test(ua)) {
    name = 'iOS'
  // } else if (/Android\s+(\d+(\.\d+)*);/i.test(ua)) {
  } else if (/Android\/\d+(\.\d+)*/i.test(ua)) {
    name = 'Android'
  }
  return {
    name,
    isIOS: name === 'iOS',
    isAndroid: name === 'Android',
    isNative: ['iOS', 'Android'].indexOf(name) !== -1
  }
}
