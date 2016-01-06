export default [
  {
    path: 'following',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/streams/Following').default)
      // })
    },
  },
  {
    path: 'starred',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/streams/Starred').default)
      // })
    },
  },
]
