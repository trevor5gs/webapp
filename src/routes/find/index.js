export default {
  path: 'find',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/Find'))
    // })
  },
}

