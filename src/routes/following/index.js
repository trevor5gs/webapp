export default {
  path: 'following',
  getComponents(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/FollowingView'))
    })
  },
}

