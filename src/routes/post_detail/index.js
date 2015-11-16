export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/PostDetail'))
    // })
  },
}

