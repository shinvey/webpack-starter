import component, { lostGrid, ResponsiveImage, loadImage, combine } from '../../components/hello-world'
import './example1.pcss'
import './example.scss'
import Person from '../../components/critical/Person'
import { plus } from '../../components/shared/util'
// import isArray from 'lodash/isArray'
import LazyLoad from 'vanilla-lazyload'

document.body.appendChild(component())
document.body.appendChild(lostGrid())
document.body.appendChild(loadImage())
document.body.appendChild(ResponsiveImage())

document.addEventListener('DOMContentLoaded', () => {
  // The "lazyLazy" instance of lazyload is used (kinda improperly)
  // to check when the .horzContainer divs enter the viewport
  const lazyLazy = new LazyLoad({
    // container: document.querySelector('section'),
    elements_selector: 'section > div',
    // When the .horzContainer div enters the viewport...
    callback_enter: function (el) {
      // ...instantiate a new LazyLoad on it
      console.debug('You are entered ', el)
    }
  })
  console.debug('lazyLazy ', lazyLazy)
})

Person.say('hello world')

import('./Animal').then(({ default: Animal }) => {
  Animal.run()
})

// 打印webpack注入的环境变量
console.debug('APP_VERSION', env.APP_VERSION)
console.debug('SVC_ENV', env.SVC_ENV)

console.debug(plus('a', 'b'))
console.debug(combine())

// console.debug(isArray({ a: 1 }))
