export default {
  path: 'following',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/Following'))
    // })
  },
}

