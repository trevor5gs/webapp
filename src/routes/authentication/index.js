import EnterContainer from '../../containers/EnterContainer'
import SignupContainer from '../../containers/SignupContainer'
import ForgotPasswordContainer from '../../containers/ForgotPasswordContainer'

export default (store) => {
  function onEnter(nextState, replace) {
    const {
      authentication: { isLoggedIn },
      gui: { currentStream },
    } = store.getState()
    if (isLoggedIn) {
      replace({ pathname: currentStream, state: nextState })
    } else if (/\/signup/.test(nextState.location.pathname)) {
      const pathname = nextState.params.invitationCode ? `/join/${nextState.params.invitationCode}` : '/join'
      replace({ pathname, state: nextState })
      console.log('enter', nextState)
    }
  }

  return [
    {
      path: 'enter',
      getComponents(location, cb) {
        cb(null, EnterContainer)
      },
      onEnter,
    },
    {
      path: 'forgot-password',
      getComponents(location, cb) {
        cb(null, ForgotPasswordContainer)
      },
      onEnter,
    },
    {
      path: 'join(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, SignupContainer)
      },
      onEnter,
    },
    {
      path: 'signup(/:invitationCode)',
      getComponents(location, cb) {
        cb(null, SignupContainer)
      },
      onEnter,
    },
  ]
}

