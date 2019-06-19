import { plus } from '../shared/util'

export default class Person {
  static say (word) {
    console.info(plus(word, ''))
  }
}
