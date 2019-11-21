import { PING, PONG } from './pingAction'
// import { addActionTranslator } from '../../AppBridge/SyncState'

/**
 * 以下两个action translator，起到了状态同步的作用
 * 当其他模块dispatch hey action时，ping action 也能收到
 * 当其他模块dispatch ping action时，hey action 也能收到
 * 而且它们互不影响，不会形成死循环
 */
// addActionTranslator('HEY', action => {
//   action.type = PING
//   return action
// })
// addActionTranslator(PING, action => {
//   action.type = 'HEY'
//   return action
// })

export const pingReducer = (state = { isPinging: false }, action) => {
  switch (action.type) {
    case PING:
      return { isPinging: true }

    case PONG:
      return { isPinging: false }

    default:
      return state
  }
}
