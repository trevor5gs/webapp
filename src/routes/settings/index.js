export default [
  {
    path: 'settings',
    getComponents(location, cb) {
      cb(null, require('../../containers/settings/Settings').default)
    },
  },
]
