import { set } from 'lodash'
import AppContainer from '../containers/AppContainer'
import { refreshAuthenticationToken } from '../actions/authentication'
import {
  fetchAuthenticationPromos,
  fetchLoggedInPromos,
  fetchLoggedOutPromos,
} from '../actions/promotions'
import PostDetailRoute from './post_detail'
import WTFRoute from './wtf'
import authenticationRoutes from './authentication'
import {
  getComponents as getDiscoverComponents,
  discover as discoverRoute,
  explore as exploreRoute,
} from './discover'
import StreamsRoutes from './streams'
import NotificationsRoute from './notifications'
import InvitationsRoutes from './invitations'
import SettingsRoutes from './settings'
import OnboardingRoutes from './onboarding'
import SearchRoutes from './search'
import UserDetailRoute from './user_detail'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replace) {
      replace({ pathname: to, state: nextState })
    },
  }
}

// TODO: this seems a bit goofy but I couldn't think on a friday
// of a better way to load in all of the types to be available
// for all of the possible scenarios that they show up on
// especially since they might get added to following/starred
// might want to make a single call to get all promos instead
// and then just key off of a name to get the right ones
function fetchAllPromos(store, callback) {
  const authPromoFn = () => {
    const loggedOutPromoFn = () => {
      const loggedOutPromoAction = fetchLoggedOutPromos()
      set(loggedOutPromoAction, 'meta.successAction', callback)
      set(loggedOutPromoAction, 'meta.failureAction', callback)
      store.dispatch(loggedOutPromoAction)
    }
    const loggedInPromoAction = fetchLoggedInPromos()
    set(loggedInPromoAction, 'meta.successAction', loggedOutPromoFn)
    set(loggedInPromoAction, 'meta.failureAction', loggedOutPromoFn)
    store.dispatch(loggedInPromoAction)
  }
  const authPromoAction = fetchAuthenticationPromos()
  set(authPromoAction, 'meta.successAction', authPromoFn)
  set(authPromoAction, 'meta.failureAction', authPromoFn)
  store.dispatch(authPromoAction)
}

const routes = (store, isServer = false) => {
  // Wrap up authenticated routes
  const authenticate = (route) => {
    const oldOnEnter = route.onEnter
    if (typeof oldOnEnter === 'undefined') {
      return {
        ...route,
        onEnter(nextState, replace) {
          const { authentication: { isLoggedIn } } = store.getState()
          if (!isLoggedIn) {
            replace({ pathname: '/enter', state: nextState })
          }
        },
      }
    }

    return {
      ...route,
      onEnter(nextState, replace) {
        const { authentication: { isLoggedIn } } = store.getState()
        if (!isLoggedIn) {
          replace({ pathname: '/enter', state: nextState })
        } else {
          oldOnEnter(nextState, replace)
        }
      },
    }
  }

  const indexRoute = {
    getComponents: getDiscoverComponents,
    onEnter(nextState, replace) {
      const {
        authentication: { isLoggedIn },
        gui: { currentStream },
      } = store.getState()

      if (isLoggedIn) {
        replace({ pathname: currentStream, state: nextState })
      }
    },
  }

  return [
    {
      path: '/',
      component: AppContainer,
      indexRoute,
      // order matters, so less specific routes should go at the bottom
      childRoutes: [
        WTFRoute,
        PostDetailRoute,
        ...authenticationRoutes(store),
        discoverRoute(store),
        exploreRoute(store),
        ...StreamsRoutes.map(route => authenticate(route)),
        authenticate(NotificationsRoute),
        ...InvitationsRoutes.map(route => authenticate(route)),
        ...SettingsRoutes.map(route => authenticate(route)),
        createRedirect('onboarding', '/onboarding/communities'),
        ...OnboardingRoutes.map(route => authenticate(route)),
        ...SearchRoutes,
        UserDetailRoute,
      ],
      onEnter(nextState, replace, callback) {
        const { authentication: { isLoggedIn } } = store.getState()
        if (!isLoggedIn && !isServer) {
          const refreshAction = refreshAuthenticationToken()
          set(refreshAction, 'meta.successAction', fetchAllPromos(store, callback))
          set(refreshAction, 'meta.failureAction', fetchAllPromos(store, callback))
          store.dispatch(refreshAction)
        } else {
          fetchAllPromos(store, callback)
        }
      },
    },
  ]
}

export default routes

