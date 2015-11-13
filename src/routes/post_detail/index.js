export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../components/views/PostDetailView'))
    // })
  },
}

