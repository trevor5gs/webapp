import { set } from 'lodash'
import SignIn from '../../containers/authentication/SignIn'
import Join from '../../containers/authentication/Join'
import SignUp from '../../containers/authentication/SignUp'
import ForgotPassword from '../../containers/authentication/ForgotPassword'

import { fetchAuthenticationPromos } from '../../actions/promotions'

export default (store) => {
  function onEnter(nextState, replace, callback) {
    const {
      authentication: { isLoggedIn },
      gui: { currentStream },
    } = store.getState()
    if (isLoggedIn) {
      replace({ pathname: currentStream, state: nextState })
      callback()
    } else {
      const fetchPromoAction = fetchAuthenticationPromos()
      set(fetchPromoAction, 'meta.successAction', callback)
      set(fetchPromoAction, 'meta.failureAction', callback)
      store.dispatch(fetchPromoAction)
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

