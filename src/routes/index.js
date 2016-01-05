import App from '../containers/App'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replaceState) {
      replaceState(nextState, to)
    },
  }
}

const routes = [
  createRedirect('/', '/explore'),
  {
    path: '/',
    component: App,
    // order matters, so less specific routes should go at the bottom
    childRoutes: [
      require('./post_detail'),
      ...require('./authentication'),
      ...require('./discover'),
      ...require('./streams'),
      require('./notifications'),
      ...require('./settings'),
      ...require('./invitations'),
      createRedirect('onboarding', '/onboarding/communities'),
      require('./onboarding'),
      ...require('./search'),
      require('./user_detail'),
    ],
  },
]

export default routes

