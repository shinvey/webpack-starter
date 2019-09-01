import { ofType } from 'redux-observable'
import { delay, map } from 'rxjs/operators'
// import { ajax } from 'rxjs/ajax'
import { asyncSetTheme, setThemeActionCreator } from './actions'

const themeEpic = (action$, state$) => {
  return action$.pipe(
    ofType(asyncSetTheme),
    delay(1000), // Asynchronously wait 1000ms then continue
    map(action => setThemeActionCreator(action.payload))
  )
}

export default themeEpic
