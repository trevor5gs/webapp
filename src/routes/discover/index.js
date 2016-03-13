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

const bindOnEnter = path => (nextState, replaceState) => {
  const type = nextState.params.type

  // redirect back to root path if type is unrecognized
  if (type && TYPES.indexOf(type) === -1) {
    replaceState(nextState, path)
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
}

export default [
  discover,
  explore,
]

