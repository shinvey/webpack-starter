// 存储到localStorage
import { isPlainObj } from 'sunny-js/util/object'

export function saveToLocal (data) {
  return saveTo(localStorage, data)
}

// 存储到sessionStorage
export function saveToSession (data) {
  return saveTo(sessionStorage, data)
}

// 存储到localStorage
export function saveTo (storage, data) {
  return Object.entries(data).forEach(([key, value]) => {
    storage.setItem(key, isPlainObj(value) ? JSON.stringify(value) : value)
  })
}
