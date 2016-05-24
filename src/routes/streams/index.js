import FollowingContainer from '../../containers/FollowingContainer'
import StarredContainer from '../../containers/StarredContainer'

export default [
  {
    path: 'following',
    getComponents(location, cb) {
      cb(null, FollowingContainer)
    },
  },
  {
    path: 'starred',
    getComponents(location, cb) {
      cb(null, StarredContainer)
    },
  },
]

