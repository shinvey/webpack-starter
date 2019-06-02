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
