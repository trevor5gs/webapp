import SignIn from '../../containers/authentication/SignIn'
import Join from '../../containers/authentication/Join'
import SignUp from '../../containers/authentication/SignUp'
import ForgotPassword from '../../containers/authentication/ForgotPassword'

export default [
  {
    path: 'enter',
    getComponents(location, cb) {
      cb(null, SignIn)
    },
  },
  {
    path: 'join(/:invitationCode)',
    getComponents(location, cb) {
      cb(null, Join)
    },
  },
  {
    path: 'signup',
    getComponents(location, cb) {
      cb(null, SignUp)
    },
  },
  {
    path: 'forgot-password',
    getComponents(location, cb) {
      cb(null, ForgotPassword)
    },
  },
]

