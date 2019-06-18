import component, { lostGrid, ResponsiveImage, Animal, loadImage } from '../../components/hello-world'
import './example1.pcss'
import './example.scss'

class Person {
  static say (word) {
    console.info(word)
  }
}

document.body.appendChild(component())
document.body.appendChild(lostGrid())
document.body.appendChild(loadImage())
document.body.appendChild(ResponsiveImage())

Person.say('hello world')
Animal.run()

// 打印webpack注入的环境变量
console.debug('APP_VERSION', env.APP_VERSION)
console.debug('SVC_ENV', env.SVC_ENV)
