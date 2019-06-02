import component, { lostGrid, Animal } from '../../components/hello-world'
import './example1.pcss'
import './example.scss'

class Person {
  static say (word) {
    console.info(word)
  }
}

// document.body.appendChild(component())
document.body.appendChild(lostGrid())

Person.say('hello world')
// Animal.run()
