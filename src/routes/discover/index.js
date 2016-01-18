const TYPES = [
  'communities',
  'featured-users',
  'recent',
  'recommended',
  'trending',
]

export default [
  {
    path: 'discover(/:type)',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/discover/Discover').default)
      // })
    },
    onEnter(nextState, replaceState) {
      const type = nextState.params.type
      // redirect back to /discover if type is unrecognized
      if (type && TYPES.indexOf(type) === -1) {
        replaceState(nextState, '/discover')
      }
    },
  },
  {
    path: 'explore(/:type)',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/discover/Discover').default)
      // })
    },
    onEnter(nextState, replaceState) {
      const type = nextState.params.type
      // redirect back to /explore if type is unrecognized
      if (type && TYPES.indexOf(type) === -1) {
        replaceState(nextState, '/explore')
      }
    },
  },
]

