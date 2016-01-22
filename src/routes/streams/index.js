export default [
  {
    path: 'following',
    getComponents(location, cb) {
      cb(null, require('../../containers/streams/Following').default)
    },
  },
  {
    path: 'starred',
    getComponents(location, cb) {
      cb(null, require('../../containers/streams/Starred').default)
    },
  },
]
