const TYPES = [
  'awesome-people',
  'communities',
  'profile-avatar',
  'profile-bio',
  'profile-header',
]

export default {
  path: 'onboarding(/:type)',
  getComponent(location, cb) {
    cb(null, require('../../containers/onboarding/Onboarding').default)
  },
  onEnter(nextState, replace) {
    const type = nextState.params.type
    // redirect back to /username if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replace({ pathname: '/communities', state: nextState })
    }
  },
}

