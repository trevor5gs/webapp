export default [
  {
    path: 'enter',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/authentication/SignIn'))
      // })
    },
  },
  {
    path: 'join',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/authentication/Join'))
      // })
    },
  },
]

