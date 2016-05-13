import UserDetail from '../../containers/details/UserDetail'

const TYPES = [
  'following',
  'followers',
  'loves',
]

export default {
  path: ':username(/:type)',
  getComponents(location, cb) {
    cb(null, UserDetail)
  },
  onEnter(nextState, replace) {
    const type = nextState.params.type
    // redirect back to /username if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replace({ pathname: `/${nextState.params.username}`, state: nextState })
    }
  },
}

