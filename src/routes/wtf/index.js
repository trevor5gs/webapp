export default {
  path: 'wtf',
  onEnter(nextState, replaceState, callback) {
    if (callback) {
      document.location.href = ENV.AUTH_DOMAIN + nextState.location.pathname
    }
  },
}

