import Search from '../../containers/search/Search'

export default [
  {
    path: 'search',
    getComponent(location, cb) {
      cb(null, Search)
    },
  },
  {
    path: 'find',
    onEnter: (nextState, replace) => {
      replace({ state: nextState, pathname: '/search' })
    },
  },
]

