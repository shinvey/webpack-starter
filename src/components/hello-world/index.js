/**
 * stringify
 * @param {Object} obj
 * @returns {string}
 */
export function stringify (obj) {
  return obj.toString()
}

export class Animal {
  static run () {
    console.info('Running')
  }
}

export async function msg () {
  let val = await Promise.resolve('ok')
  return val + ' yes'
}

export default (text = 'Hello world', ...args) => {
  const element = document.createElement('div')

  Promise.resolve(args).then(val => console.log('args ', val))

  element.innerHTML = text

  return element
}
