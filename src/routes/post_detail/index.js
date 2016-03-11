export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    cb(null, require('../../containers/details/PostDetail').default)
  },
}
