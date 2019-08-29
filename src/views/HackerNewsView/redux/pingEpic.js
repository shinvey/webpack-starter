import { ofType } from 'redux-observable'
import { delay, mapTo } from 'rxjs/operators'
import { PING, pong } from './pingAction'

const pingEpic = action$ => {
  return action$.pipe(
    ofType(PING),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo(pong())
  )
}

export default pingEpic
