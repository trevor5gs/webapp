export default [
  {
    path: 'onboarding/communities',
    getComponent(location, cb) {
      cb(null, require('../../containers/onboarding/Communities').default)
    },
  },
  {
    path: 'onboarding/awesome-people',
    getComponent(location, cb) {
      cb(null, require('../../containers/onboarding/AwesomePeople').default)
    },
  },
  {
    path: 'onboarding/profile-header',
    getComponent(location, cb) {
      cb(null, require('../../containers/onboarding/ProfileHeader').default)
    },
  },
  {
    path: 'onboarding/profile-avatar',
    getComponent(location, cb) {
      cb(null, require('../../containers/onboarding/ProfileAvatar').default)
    },
  },
  {
    path: 'onboarding/profile-bio',
    getComponent(location, cb) {
      cb(null, require('../../containers/onboarding/ProfileBio').default)
    },
  },
]

