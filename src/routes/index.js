import App from '../containers/App'
import PostDetailRoute from './post_detail'
import AuthenticationRoutes from './authentication'
import DiscoverRoutes, { getComponents as getDiscoverComponents } from './discover'
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
        ...DiscoverRoutes,
        ...StreamsRoutes,
        NotificationsRoute,
        ...InvitationsRoutes,
        ...SettingsRoutes,
        createRedirect('onboarding', '/onboarding/communities'),
        OnboardingRoute,
        ...SearchRoutes,
        UserDetailRoute,
      ],
    },
  ]
}

export default routes
