import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'

import { navigation } from './index'
import fakeAuth from '../UserStore'

/**
 * 定义一个需要用户登录才能使用的路由
 * @param Component
 * @param rest
 * @returns {*}
 * @constructor
 */
export default function AuthRoute ({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          // 如果未登录则跳转到登录界面
          <Redirect
            to={{
              pathname: navigation.path,
              state: {
                // 当前的location位置，在登录成功后会返回
                from: props.location
              }
            }}
          />
        )
      }
    />
  )
}
