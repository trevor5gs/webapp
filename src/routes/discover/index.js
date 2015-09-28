export default {
  path: 'discover',
  getComponents(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/DiscoverView'))
    })
  },
}

