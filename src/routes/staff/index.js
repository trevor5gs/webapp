export default {
  path: 'staff',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/Staff'))
    // })
  },
}

