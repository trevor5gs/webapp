import Settings from '../../containers/settings/Settings'

export default [
  {
    path: 'settings',
    getComponents(location, cb) {
      cb(null, Settings)
    },
  },
]

