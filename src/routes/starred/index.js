export default {
  path: 'starred',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/Starred'))
    // })
  },
}

