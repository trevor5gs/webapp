import FollowingContainer from '../../containers/FollowingContainer'

export default [
  {
    path: 'following',
    getComponents(location, cb) {
      cb(null, FollowingContainer)
    },
  },
]

