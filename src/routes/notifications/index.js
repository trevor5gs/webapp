import Notifications from '../../containers/notifications/Notifications'

const TYPES = [
  'all',
  'comments',
  'loves',
  'mentions',
  'relationships',
  'reposts',
]

export default {
  path: 'notifications(/:type)',
  getComponents(location, cb) {
    cb(null, Notifications)
  },
  onEnter(nextState, replaceState) {
    const type = nextState.params.type
    // redirect back to /notifications if type is unrecognized
    if (type && TYPES.indexOf(type) === -1) {
      replaceState(nextState, '/notifications')
    }
  },
}

