export default {
  path: 'staff',
  getComponents(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/StaffView'))
    })
  },
}

