import SignIn from '../../containers/authentication/SignIn'
import Join from '../../containers/authentication/Join'
import SignUp from '../../containers/authentication/SignUp'
import ForgotPassword from '../../containers/authentication/ForgotPassword'

export default (store) => {
  function onEnter(nextState, replace) {
    const {
      authentication: { isLoggedIn },
      gui: { currentStream },
    } = store.getState()
    if (isLoggedIn) {
      replace({ pathname: currentStream, state: nextState })
    }
  }

  return [
    {
      path: 'enter',
      getComponents(location, cb) {
        cb(null, SignIn)
      },
      onEnter,
    },
    {
      path: 'join(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, Join)
      },
    },
    {
      path: 'signup',
      getComponents(location, cb) {
        cb(null, SignUp)
      },
    },
    {
      path: 'forgot-password',
      getComponents(location, cb) {
        cb(null, ForgotPassword)
      },
    },
  ]
}

