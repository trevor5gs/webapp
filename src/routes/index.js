import App from '../containers/App'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replace) {
      replace({ pathname: to, state: nextState })
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
      require('./post_detail').default,
      ...require('./authentication').default,
      ...require('./discover').default,
      ...require('./streams').default,
      require('./notifications').default,
      ...require('./invitations').default,
      ...require('./settings').default,
      ...require('./invitations').default,
      createRedirect('onboarding', '/onboarding/communities'),
      require('./onboarding').default,
      ...require('./search').default,
      require('./user_detail').default,
    ],
  },
]

export default routes

