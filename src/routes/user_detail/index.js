import store from '../../store'

export default {
  path: ':username',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/details/UserDetail'))
    // })
  },
  onEnter(nextState, replaceState, callback) {
    const state = store ? store.getState() : null
    if (state && state.authentication && state.authentication.isLoggedIn) {
      callback()
    } else {
      document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
    }
  },
}

