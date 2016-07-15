import Search from '../../containers/search/Search'
import { loadPromotions } from '../../helpers/junk_drawer'

const find = store => ({
  path: 'find',
  onEnter(nextState, replace, callback) {
    const { authentication: { isLoggedIn } } = store.getState()
    loadPromotions(isLoggedIn, callback)
    replace({ state: nextState, pathname: '/search' })
  },
})

const search = store => ({
  path: 'search',
  getComponent(location, cb) {
    cb(null, Search)
  },
  onEnter(nextState, replace, callback) {
    const { authentication: { isLoggedIn } } = store.getState()
    loadPromotions(isLoggedIn, callback)
  },
})

export {
  find,
  search,
}

export default [
  find,
  search,
]

