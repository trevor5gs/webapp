// TODO: uncomment this to lock down user paths
// const TYPES = [
//   'following',
//   'followers',
//   'loves',
// ]

export default {
  path: ':username(/:type)',
  getComponents(location, cb) {
    cb(null, require('../../containers/details/UserDetail').default)
  },
  onEnter(nextState, replaceState, callback) {
    if (callback) {
      document.location.href = ENV.REDIRECT_URI + nextState.location.pathname
    }
  },
  // TODO: uncomment this to lock down user paths
  // onEnter(nextState, replaceState) {
  //   const type = nextState.params.type
  //   // redirect back to /username if type is unrecognized
  //   if (type && TYPES.indexOf(type) === -1) {
  //     replaceState(nextState, `/${nextState.params.username}`)
  //   }
  // },
}

