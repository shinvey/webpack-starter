import { action, observable } from 'mobx'

const appState = observable({
  timer: 0
})

appState.resetTimer = action(function reset () {
  appState.timer = 0
})

appState.tick = action(function tick () {
  appState.timer += 1
})

export default appState
