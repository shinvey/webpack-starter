/**
 * stringify
 * @param {Object} obj
 * @returns {string}
 */
import { plus } from '../shared/util'
import blueRose from './blue-rose.jpeg'

export function stringify (obj) {
  return obj.toString()
}

export async function msg () {
  const val = 'ok'
  return val + ' yes'
}

export default (text = 'Hello world', ...args) => {
  const element = document.createElement('div')

  Promise.resolve(args).then(val => console.log('args ', val))

  element.classList.add('box')
  element.innerHTML = text

  return element
}

// lostGrid system, basic example
export function lostGrid () {
  const element = document.createElement('section')
  element.innerHTML = '<div>1</div>\n' +
    '  <div>2</div>\n' +
    '  <div>3</div>\n' +
    '  <div>4</div>'
  return element
}

/**
 * Responsive Images使用场景
 * 图像会被生成多个大小不同尺寸的图像
 * @returns {HTMLImageElement}
 */
export function ResponsiveImage () {
  const img = new Image()
  import('./Paris.srcset.jpg').then(({ default: responsiveImage }) => {
    img.src = responsiveImage.src
    img.srcset = responsiveImage.srcSet
  })
  return img
}

/**
 * 普通图片使用场景
 * 默认会被压缩优化
 * @returns {HTMLImageElement}
 */
export function loadImage () {
  const img = new Image()
  import('./blue-rose.jpeg').then(({ default: src }) => {
    img.src = src
  })
  img.src = blueRose
  return img
}

export function combine () {
  return plus(1, 2)
}