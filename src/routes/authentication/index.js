import Enter from '../../containers/authentication/Enter'
import JoinContainer from '../../containers/JoinContainer'
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
        cb(null, Enter)
      },
      onEnter,
    },
    {
      path: 'join(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, JoinContainer)
      },
      onEnter,
    },
    {
      path: 'signup',
      getComponents(location, cb) {
        cb(null, SignUp)
      },
      onEnter,
    },
    {
      path: 'forgot-password',
      getComponents(location, cb) {
        cb(null, ForgotPassword)
      },
      onEnter,
    },
  ]
}

