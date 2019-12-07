import userReducer from './userReducer'

/**
 * 用户信息
 * RDM 表示redux dynamic module
 */
export default function userRDM () {
  return {
    id: 'user-module',
    reducerMap: {
      user: userReducer
    },
  }
}
