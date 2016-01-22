export default [
  {
    path: 'invitations',
    getComponents(location, cb) {
      cb(null, require('../../containers/invitations/Invitations').default)
    },
  },
]
