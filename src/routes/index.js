import App from '../containers/App'
import LoggedOutDiscover from '../containers/discover/LoggedOutDiscover'

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
      require('./post_detail'),
      ...require('./authentication'),
      ...require('./discover'),
      ...require('./streams'),
      require('./notifications'),
      createRedirect('onboarding', '/onboarding/communities'),
      require('./onboarding'),
      ...require('./search'),
      require('./user_detail'),
    ],
  },
]

export default routes

