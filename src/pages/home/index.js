import component, { Animal } from '../../components/hello-world'
import './example.pcss'

class Person {
  static say (word) {
    console.info(word)
  }
}

document.body.appendChild(component())

Person.say('hello world')
// Animal.run()
