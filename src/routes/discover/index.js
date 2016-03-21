const TYPES = [
  'communities',
  'featured-users',
  'recent',
  'recommended',
  'trending',
]

const getComponents = (location, cb) => {
  cb(null, require('../../containers/discover/Discover').default)
}

const bindOnEnter = path => (nextState, replace) => {
  const type = nextState.params.type

  // redirect back to root path if type is unrecognized
  if (type && TYPES.indexOf(type) === -1) {
    replace({ state: nextState, pathname: path })
  }
}

const indexRoute = {
  getComponents,
}

const explore = {
  path: 'explore(/:type)',
  getComponents,
  onEnter: bindOnEnter('/explore'),
}

const exploreRoot = store => ({
  path: '/explore',
  getComponents,
  onEnter: (nextState, replace) => {
    const { params: { type } } = nextState
    const { authentication } = store.getState()

    const rootPath = authentication.isLoggedIn ? '/discover' : '/'

    if (type && TYPES.indexOf(type) === -1) {
      replace({ state: nextState, pathname: rootPath })
    } else if (authentication.isLoggedIn) {
      replace({ state: nextState, pathname: '/discover' })
    } else {
      replace({ state: nextState, pathname: '/' })
    }
  },
})

const discover = {
  path: 'discover(/:type)',
  getComponents,
  onEnter: bindOnEnter('/discover'),
}

export {
  indexRoute,
  getComponents,
  discover,
  explore,
  exploreRoot,
}

export default [
  discover,
  explore,
]
