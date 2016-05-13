import Following from '../../containers/streams/Following'
import Starred from '../../containers/streams/Starred'

export default [
  {
    path: 'following',
    getComponents(location, cb) {
      cb(null, Following)
    },
  },
  {
    path: 'starred',
    getComponents(location, cb) {
      cb(null, Starred)
    },
  },
]

