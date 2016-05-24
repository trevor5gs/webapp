import FollowingContainer from '../../containers/FollowingContainer'
import Starred from '../../containers/streams/Starred'

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
      cb(null, Starred)
    },
  },
]

