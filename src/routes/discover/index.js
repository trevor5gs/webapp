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
      cb(null, require('../../containers/discover/Discover'))
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
    path: '/recent',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/discover/LoggedOutDiscover'))
      // })
    },
  },
  {
    path: '/trending',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/discover/LoggedOutDiscover'))
      // })
    },
  },
]

