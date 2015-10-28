export default {
  path: ':username',
  getComponents(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/UserDetailView'))
    })
  },
}

