import { actionCreator } from '../../utils/redux.helper'

export const NS = 'USER'
export const UPDATE_USER_INFO = `${NS}/UPDATE_USER_INFO`

export function updateUserInfoAction (payload) {
  return actionCreator(UPDATE_USER_INFO, payload)
}
