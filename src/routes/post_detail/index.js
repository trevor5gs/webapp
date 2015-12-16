import * as ENV from '../../../env'

export default {
  path: ':username/post/:token',
  getComponents(location, cb) {
    // require.ensure([], (require) => {
    cb(null, require('../../containers/details/PostDetail'))
    // })
  },
  onEnter(nextState, replaceState, callback) {
    if (callback) {
      const redirectPath = ENV.REDIRECT_URI + nextState.location.pathname
      document.location.href = redirectPath
    }
  },
}

