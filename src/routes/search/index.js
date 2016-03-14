export default [
  {
    path: 'search',
    getComponent(location, cb) {
      cb(null, require('../../containers/search/Search').default)
    },
  },
  {
    path: 'find',
    getComponent(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/search/Search').default)
      // })
    },
  },
]

