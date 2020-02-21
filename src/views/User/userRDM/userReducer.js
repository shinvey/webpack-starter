import produce from 'immer'
import { UPDATE_USER_INFO } from './userActions'
// import { addActionTranslator } from '../../Bridge/SyncState'

// const getUserInfoReducer = 'app/getUserInfoReducer'
// 映射到旧应用的getUserInfoReducer
// addActionTranslator(UPDATE_USER_INFO, action => {
//   action.type = getUserInfoReducer
//   action.payload = {
//     data: action.payload,
//   }
//   return action
// })
// 映射到新应用的UPDATE_USER_INFO
// addActionTranslator(getUserInfoReducer, action => {
//   action.type = UPDATE_USER_INFO
//   action.payload = action.payload.data
//   return action
// })

const userReducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_USER_INFO: {
      Object.assign(draft, action.payload)
      break
    }
  }
}, {})

export default userReducer
