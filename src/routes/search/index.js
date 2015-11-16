const routes = [
  {
    path: 'search',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/Search'))
      // })
    },
  },
  {
    path: 'find',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/Search'))
      // })
    },
  },
]

export default routes

