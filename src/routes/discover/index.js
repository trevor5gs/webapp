const TYPES = [
  'random',
  'recent',
  'recommended',
  'related',
  'trending',
]

export default {
  path: 'discover(/:type)',
  getComponents(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/DiscoverView'))
    })
  },
  onEnter(nextState, replaceState) {
    const type = nextState.params.type
    // redirect back to /discover if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replaceState(nextState, '/discover')
    }
  },
}

