import App from '../containers/App'
import Discover from '../containers/Discover'

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
    indexRoute: { component: Discover },
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
      require('./user_detail'),
    ],
  },
]

export default routes

