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
  createRedirect('/', '/following'),
  {
    path: '/',
    component: App,
    childRoutes: [
      require('./discover'),
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

