import App from '../containers/App'
import PostDetailRoute from './post_detail'
import AuthenticationRoutes from './authentication'
import DiscoverRoutes, {
  getComponents as getDiscoverComponents,
  discover as DiscoverRoute,
  explore as ExploreRoute,
} from './discover'
import StreamsRoutes from './streams'
import NotificationsRoute from './notifications'
import InvitationsRoutes from './invitations'
import SettingsRoutes from './settings'
import OnboardingRoute from './onboarding'
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
            replace({ pathName: '/enter', state: nextState })
          }
        },
      }
    }

    return {
      ...route,
      onEnter(nextState, replace) {
        const { authentication: { isLoggedIn } } = store.getState()
        if (!isLoggedIn) {
          replace({ pathName: '/enter', state: nextState })
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
        ...AuthenticationRoutes,
        authenticate(DiscoverRoute),
        ExploreRoute,
        ...StreamsRoutes.map(route => authenticate(route)),
        authenticate(NotificationsRoute),
        ...InvitationsRoutes.map(route => authenticate(route)),
        ...SettingsRoutes.map(route => authenticate(route)),
        createRedirect('onboarding', '/onboarding/communities'),
        authenticate(OnboardingRoute),
        ...SearchRoutes,
        UserDetailRoute,
      ],
    },
  ]
}

export default routes
