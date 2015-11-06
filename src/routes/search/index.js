export default {
  path: 'search',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../components/views/SearchView'))
    // })
  },
}

