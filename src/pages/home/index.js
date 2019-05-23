import component from '../../components/hello-world'

class Person {
  static say (word) {
    console.info(word)
  }
}

document.body.appendChild(component())

Person.say('hello world')
