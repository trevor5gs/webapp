export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/details/PostDetail').default)
    // })
  },
  // onEnter(nextState, replaceState, callback) {
  //   if (callback) {
  //     document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
  //   }
  // },
}

