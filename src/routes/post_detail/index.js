let store = null
if (typeof window === 'undefined') {
  store = require('../../store_server')
} else {
  store = require('../../store')
}

export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/details/PostDetail'))
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

