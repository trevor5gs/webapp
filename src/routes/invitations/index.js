import Invitations from '../../containers/invitations/Invitations'

export default [
  {
    path: 'invitations',
    getComponents(location, cb) {
      cb(null, Invitations)
    },
  },
]

