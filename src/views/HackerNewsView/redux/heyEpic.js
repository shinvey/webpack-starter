import { ofType } from 'redux-observable'
import { delay, mapTo } from 'rxjs/operators'

const heyEpic = action$ => {
  return action$.pipe(
    ofType('HEY'),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo({ type: 'HI' })
  )
}

export default heyEpic
