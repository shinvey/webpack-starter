// import { get } from '../../Request/ajaxPromise'

export function loginSVC (params) {
  // return get('/api/login', params)
  return Promise.resolve({
    token: 'hashed-user-token'
  })
}
