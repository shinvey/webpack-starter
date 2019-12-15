import { bindActionCreators } from 'redux'
import store from '../store'
import { actionCreatorFn } from '../../utils/redux.helper'
import { UPDATE_SETTINGS } from './appReducer'

const { dispatch } = store

export const updateAppSettings = bindActionCreators(actionCreatorFn(UPDATE_SETTINGS), dispatch)
