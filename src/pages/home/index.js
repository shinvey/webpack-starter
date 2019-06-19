import component, { lostGrid, ResponsiveImage, loadImage, combine } from '../../components/hello-world'
import './example1.pcss'
import './example.scss'
import Person from '../../components/critical/Person'
import { plus } from '../../components/shared/util'
// import isArray from 'lodash/isArray'

document.body.appendChild(component())
document.body.appendChild(lostGrid())
document.body.appendChild(loadImage())
document.body.appendChild(ResponsiveImage())

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
