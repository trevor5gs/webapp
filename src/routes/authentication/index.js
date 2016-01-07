export default [
  {
    path: 'enter',
    getComponents(location, cb) {
      cb(null, require('../../containers/authentication/SignIn').default)
    },
  },
  {
    path: 'join',
    getComponents(location, cb) {
      cb(null, require('../../containers/authentication/Join').default)
    },
  },
  {
    path: 'signup',
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/authentication/SignUp').default)
      // })
    },
  },
  {
    path: 'forgot-password',
    getComponents(location, cb) {
      cb(null, require('../../containers/authentication/ForgotPassword').default)
    },
  },
]

