export default {
  path: ':username',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/details/UserDetail'))
    // })
  },
  onEnter(nextState, replaceState, callback) {
    if (callback) {
      document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
    }
  },
}

