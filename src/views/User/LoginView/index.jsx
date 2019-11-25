import React, { useEffect } from 'react'
import loadable from 'react-loadable'
import Loading from '../../components/Loading'
import { onRequestLogin } from '../../Auth/channel'
import history from '../../Container/history'

export const route = {
  key: 'login',
  name: '用户登录',
  path: '/user/login',
}

const View = loadable({
  loader: () => import(/* webpackChunkName: "UserLogin" */'./View'),
  loading: Loading
})

export function Content (props) {
  useEffect(() => {
    // 登录视图检测到登录事件后，执行登录视图跳转
    const subscription = onRequestLogin((from = { pathname: '/' }) => {
      // 如果将登录事件绑定到请求上，可能会多次发送登录事件，加上是否已经在登录界面到判断
      // 如果已经在登录界面，还接收到登录事件，则可以忽略
      if (route.path !== history.location.pathname) {
        console.debug('request login, so forward to ', route.path, ' from ', from)
        history.push(route.path, { from })
      }
    })
    return function cleanup () {
      subscription.unsubscribe()
    }
  }, [])

  return <View {...props} />
}
