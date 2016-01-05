export default [
  {
    path: 'settings',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/settings/settings'))
      // })
    },
  },
]
