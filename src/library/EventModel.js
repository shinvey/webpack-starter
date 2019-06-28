/* eslint-disable eqeqeq,func-names,prefer-const,no-prototype-builtins,
no-restricted-syntax,no-continue,prefer-rest-params,no-param-reassign,
no-unused-expressions,no-var */
/**
 * 事件模型
 * 为对象提供标准on、off、trigger方法
 * @mixin
 */
export default {
  _events: null,
  _eveSplit: /\s+/,
  _nsSplit: /[.:]/,
  /**
   * 事件匹配
   * @param strEve 准备触发的事件
   * @param strMatch 已绑定的事件
   * @returns {boolean}
   * @private
   */
  _isMatchEve (strEve, strMatch) {
    const arrEve = this._split(strEve, this._nsSplit)
    const arrMatch = this._split(strMatch, this._nsSplit)

    /*
     事件判断逻辑
     event    == event
     event    == event.ns
     event.ns == event.ns
     .ns      == event.ns
     menu:share:friend == menu:share:friend
     */
    if (arrEve.length == 1) {
      return arrEve[0] == arrMatch[0]
    } else if (arrEve.length == 2) {
      return arrEve[0] ? strEve == strMatch : arrEve[1] == arrMatch[1]
    } else if (arrEve.length == arrMatch.length) {
      return strEve == strMatch
    }

    return false
  },
  _split (name, regex) {
    return name.trim().split(regex)
  },
  on (name, callback, context) {
    this._events || (this._events = {})

    const arrName = this._split(name, this._eveSplit)
    arrName.forEach(function (eve) {
      const events = this._events[eve] || (this._events[eve] = [])
      events.push({
        callback,
        ctx: context || this
      })
    }, this)
    return this
  },
  trigger (name) {
    if (!this._events) { return this }
    let events = []
    let args = [].slice.call(arguments, 1)

    this._split(name, this._eveSplit).forEach(function (eve) {
      for (const key in this._events) {
        if (!this._events.hasOwnProperty(key)) continue
        this._isMatchEve(eve, key) && (events = events.concat(this._events[key]))
      }
    }, this)

    events.forEach(e => {
      e.callback.apply(e.ctx, args)
    })
    return this
  },
  once (name, callback, context) {
    var self = this
    var once = function () {
      self.off(name, once)
      callback.apply(this, arguments)
    }
    this._split(name, this._eveSplit).forEach(function (eve) {
      this.on(eve, once, context)
    }, this)
    return this
  },
  off (name, callback, context) {
    if (!this._events) { return this }

    if (!name && !callback && !context) {
      this._events = {}
      return this
    } typeof callback === 'object' && (context = callback)

    let self = this
    let args = arguments
    let key
    let remove = function (e, k, events) {
      let or = args.length == 2 && (e.callback === callback || e.ctx === context)
      let and = args.length == 3 && (e.callback === callback && e.ctx === context);
      (or || and) && events.splice(k, 1)
      return events.length == 0
    }

    this._split(name, this._eveSplit).forEach(function (eve) {
      for (key in this._events) {
        if (!this._events.hasOwnProperty(key) || !this._isMatchEve(eve, key)) { continue }
        args.length == 1
          ? delete self._events[key] : self._events[key].some(remove) &&
          delete this._events[key]
      }
    }, this)
    return this
  }
}
