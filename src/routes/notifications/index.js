import Notifications from '../../containers/notifications/Notifications'

const CATEGORIES = [
  'all',
  'comments',
  'loves',
  'mentions',
  'relationships',
  'reposts',
]

export default {
  path: 'notifications(/:category)',
  getComponents(location, cb) {
    cb(null, Notifications)
  },
  onEnter(nextState, replaceState) {
    const category = nextState.params.category
    // redirect back to /notifications if category is unrecognized
    if (category && CATEGORIES.indexOf(category) === -1) {
      replaceState(nextState, '/notifications')
    }
  },
}

