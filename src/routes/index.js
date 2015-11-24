import App from '../containers/App'
import LoggedOutDiscover from '../containers/LoggedOutDiscover'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replaceState) {
      replaceState(nextState, to)
    },
  }
}

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: { component: LoggedOutDiscover },
    // order matters, so less specific routes should go at the bottom
    childRoutes: [
      require('./discover'),
      require('./find'),
      require('./following'),
      require('./notifications'),
      createRedirect('onboarding', '/onboarding/communities'),
      require('./onboarding'),
      require('./post_detail'),
      require('./search'),
      require('./starred'),
      require('./staff'),
      {
        path: '/recent',
        component: LoggedOutDiscover,
      },
      {
        path: '/trending',
        component: LoggedOutDiscover,
      },
      require('./user_detail'),
    ],
  },
]

export default routes

