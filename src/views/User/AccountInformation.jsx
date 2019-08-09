import React from 'react'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { navigation } from './Login'
import LoginStore from './Login/LoginStore'

/**
 * withRouter https://reacttraining.com/react-router/web/api/withRouter
 * 当前登录信息。如果未登录则展示未登录
 */
export default withRouter(
  ({ history }) => {
    const store = LoginStore.Singleton()
    return store.isLogin ? (
      <p>
        Welcome!
        <button
          onClick={() => {
            store.signOut().then(() => history.push('/'))
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in. You can <Link to={navigation.path}>{navigation.name}</Link> anywhere.</p>
    )
  }
)
