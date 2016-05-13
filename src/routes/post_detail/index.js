import PostDetail from '../../containers/details/PostDetail'

export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    cb(null, PostDetail)
  },
}

