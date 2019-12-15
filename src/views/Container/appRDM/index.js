import appReducer from './appReducer'

/**
 * 用户信息
 * RDM 表示redux dynamic module
 */
export default function appRDM () {
  return {
    id: 'app-rdm',
    reducerMap: {
      settings: appReducer,
    },
  }
}
