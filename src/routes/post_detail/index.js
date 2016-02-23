export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    cb(null, require('../../containers/details/PostDetail').default)
  },
  // TODO: kill this whole onEnter before merging to master
  // onEnter(nextState, replaceState, callback) {
  //   if (callback) {
  //     document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
  //   }
  // },
}
