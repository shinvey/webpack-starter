import produce from 'immer'
// import { addActionTranslator } from '../../Bridge/SyncState'

export const NS = 'APP'
export const UPDATE_SETTINGS = `${NS}/UPDATE_SETTINGS`

// const getPreInfoReducer = 'home/getPreInfoReducer'
// 将状态同步至getPreInfoReducer
// addActionTranslator(UPDATE_SETTINGS, action => {
//   action.type = getPreInfoReducer
//   return action
// })
// 将状态同步至UPDATE_SETTINGS
// addActionTranslator(getPreInfoReducer, action => {
//   action.type = UPDATE_SETTINGS
//   return action
// })

const appReducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      Object.assign(draft, action.payload)
      break
    }
  }
}, {})

export default appReducer
