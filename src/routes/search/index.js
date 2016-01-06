export default [
  {
    path: 'search',
    getComponent(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/search/Search'))
      // })
    },
  },
  {
    path: 'find',
    getComponent(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/search/Find'))
      // })
    },
  },
]
