/**
 * base64 encode
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
 * @param str a string prepared to encode by base64
 * @returns {string}
 */
export function b64EncodeUnicode (str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str).replace(
    /%([0-9A-F]{2})/g,
    (match, p1) => String.fromCharCode(`0x${p1}`)
  ))
}
/**
 * base64 decode
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
 * @param str a string prepared to decode by base64
 * @returns {string}
 */
export function b64DecodeUnicode (str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''))
}