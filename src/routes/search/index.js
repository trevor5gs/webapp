export default [
  {
    path: 'search',
    getComponent(location, cb) {
      cb(null, require('../../containers/search/Search').default)
    },
  },
  {
    path: 'find',
    onEnter: (nextState, replace) => {
      replace({ state: nextState, pathname: '/search' })
    },
  },
]

