export default {
  path: ':username',
  getComponents(location, cb) {
    cb(null, require('../../containers/details/UserDetail').default)
  },
  onEnter(nextState, replaceState, callback) {
    if (callback) {
      document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
    }
  },
}

