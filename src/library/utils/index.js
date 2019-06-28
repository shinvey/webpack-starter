/**
 * utils工具集
 */
export function isObj (obj) {
  return typeof obj === 'object'
}
export function isPlainObj (obj) {
  return typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}
export function isArrOrObj (el) {
  return Array.isArray(el) || isPlainObj(el)
}
export function isFn (fn) {
  return typeof fn === 'function'
}
export function isStr (v) {
  return typeof v === 'string'
}

/**
 * 为空测试
 * @param value
 * @returns {*}
 * @example
 * console.debug('isEmpty(0)', isEmpty(0)); // false
 * console.debug('isEmpty(\'\')', isEmpty('')); // true
 * console.debug('isEmpty(true)', isEmpty(true)); // false
 * console.debug('isEmpty(null)', isEmpty(null)); // true
 * console.debug('isEmpty({})', isEmpty({})); // true
 * console.debug('isEmpty([])', isEmpty([])); // true
 * console.debug('isEmpty(undefined)', isEmpty(undefined)); // true
 */
export function isEmpty (value) {
  // 测试函数，为空true，不为空false
  const test = {
    array (input) {
      return !input.length
    },
    string (input) {
      return !input.length
    },
    object (input) {
      if (isPlainObj(input)) {
        return this.array(Object.keys(input))
      } else if (Array.isArray(input)) {
        return this.array(input)
      }
      // 为null
      return !input
    },
    boolean () {
      return false
    },
    number (input) {
      return Number.isNaN(input)
    },
    undefined () {
      return true
    }
  }
  const tester = test[typeof value]
  // 如果tester存在且，tester返回true（为空），否则返回false
  return !!tester && tester.call(test, value)
}

export function uniqId (prefix) {
  uniqId._incrementId = uniqId._incrementId || 0
  return prefix + uniqId._incrementId++
}
export function noop () {}
/**
 * 生成范围随机数
 * @param min 最低数
 * @param max 最高数
 * @returns {Number}
 */
export function randInRange (min, max) {
  // eslint-disable-next-line no-mixed-operators
  return parseInt(Math.random() * (max - min + 1) + min, 10)
}
/**
 * 对象浅合并
 * @param {...Object} obj
 * @returns {Object}
 */
export function mixin (...obj) {
  return obj.reduce((dest = {}, src = {}) => {
    Object.keys(src).forEach(key => {
      // eslint-disable-next-line no-param-reassign
      dest[key] = src[key]
    })
    return dest
  })
}

/**
 * 对象深度合并
 * @todo 测试merge方法
 * @param {...Object} obj
 * @returns {Object}
 * @requires isPlainObj
 */
export function merge (...obj) {
  return obj.reduce((dest = {}, src = {}) => {
    Object.keys(src).forEach(key => {
      if (isPlainObj(src[key]) && isPlainObj(dest[key])) {
        merge(dest[key], src[key])
      } else {
        // eslint-disable-next-line no-param-reassign
        dest[key] = src[key]
      }
    })
    return dest
  })
}

/**
 * 给个对象属性路径，逐级访问属性值
 * @param {String} path required, like 'obj.prop.child'
 * @param {Object} [context] optional, like an obj
 * @returns {*}
 * @example
 * var obj = {
         *     prop:{
         *         child: function(){},
         *         brother: "hello",
         *         sister: false
         *     }
         * }
 * //间接径访问对象属性
 * propBy('obj.prop.child')
 * => function (){}
 * propBy('obj.prop.brother')
 * => "hello"
 * propBy('obj.prop.sister')
 * => false
 * propBy('obj.prop.other')
 * => undefined
 *
 * //指定context, 对象上下文
 * propBy('prop.child', obj)
 * => function (){}
 * propBy('prop.brother', obj)
 * => "hello"
 * propBy('prop.sister', obj)
 * => false
 * propBy('prop.other', obj)
 * => undefined
 */
export function propBy (path, context) {
  if (!path) return path

  let prop
  let isFirst = 1

  const arrPath = path.split('.')
  const key = arrPath.shift()
  // eslint-disable-next-line no-unmodified-loop-condition
  while (key) {
    if (isFirst) { // 首次
      prop = (context || this || window)[key]
      isFirst = 0
      // eslint-disable-next-line no-continue
      continue
    }

    if (typeof (key) === 'string' && prop != null) {
      prop = prop[key]
      // eslint-disable-next-line no-continue
      continue
    }

    return prop
  }

  return prop
}
