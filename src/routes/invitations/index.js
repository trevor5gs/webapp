export default [
  {
    path: 'invitations',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/invitations/Invitations').default)
      // })
    },
  },
]
