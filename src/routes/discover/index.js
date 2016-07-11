import { set } from 'lodash'
import DiscoverContainer from '../../containers/DiscoverContainer'
import { fetchLoggedInPromos, fetchLoggedOutPromos } from '../../actions/promotions'

const getComponents = (location, cb) => {
  cb(null, DiscoverContainer)
}

const indexRoute = {
  getComponents,
}

const explore = store => ({
  path: '/explore(/:type)',
  getComponents,
  onEnter: (nextState, replace, callback) => {
    const { params: { type } } = nextState
    const { authentication: { isLoggedIn } } = store.getState()
    const rootPath = isLoggedIn ? '/discover' : '/'

    const fetchPromoAction = isLoggedIn ? fetchLoggedInPromos() : fetchLoggedOutPromos()
    set(fetchPromoAction, 'meta.successAction', callback)
    set(fetchPromoAction, 'meta.failureAction', callback)
    store.dispatch(fetchPromoAction)

    if (!type) {
      replace({ state: nextState, pathname: rootPath })
    } else {
      replace({ state: nextState, pathname: `/discover/${type}` })
    }
  },
})

const discover = store => ({
  path: 'discover(/:type)',
  getComponents,
  onEnter: (nextState, replace, callback) => {
    const type = nextState.params.type
    const { authentication: { isLoggedIn } } = store.getState()
    const rootPath = isLoggedIn ? '/discover' : '/'

    const fetchPromoAction = isLoggedIn ? fetchLoggedInPromos() : fetchLoggedOutPromos()
    set(fetchPromoAction, 'meta.successAction', callback)
    set(fetchPromoAction, 'meta.failureAction', callback)
    store.dispatch(fetchPromoAction)

    // redirect back to root path if type is unrecognized
    // or, if a logged out user is visiting /discover, redirect to /
    if (!type && !isLoggedIn) {
      replace({ state: nextState, pathname: rootPath })
    }
  },
})

export {
  indexRoute,
  getComponents,
  discover,
  explore,
}

export default [
  discover,
  explore,
]
