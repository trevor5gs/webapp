const TYPES = [
  'following',
  'followers',
  'loves',
]

export default {
  path: ':username(/:type)',
  getComponents(location, cb) {
    cb(null, require('../../containers/details/UserDetail').default)
  },
  onEnter(nextState, replaceState) {
    const type = nextState.params.type
    // redirect back to /username if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replaceState(nextState, `/${nextState.params.username}`)
    }
  },
}

