import { get, post } from '../../Request/ajaxPromise'

export function fakeAccountLogin (params) {
  return post('/api/login/account', params)
}

export function getFakeCaptcha (mobile) {
  return get(`/api/login/captcha?mobile=${mobile}`)
}
