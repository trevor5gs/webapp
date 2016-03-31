import App from '../containers/App'
import PostDetailRoute from './post_detail'
import WTFRoute from './wtf'
import AuthenticationRoutes from './authentication'
import {
  getComponents as getDiscoverComponents,
  discover as DiscoverRoute,
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

const routes = store => {
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
      component: App,
      indexRoute,
      // order matters, so less specific routes should go at the bottom
      childRoutes: [
        PostDetailRoute,
        WTFRoute,
        ...AuthenticationRoutes,
        authenticate(DiscoverRoute),
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
    },
  ]
}

export default routes
