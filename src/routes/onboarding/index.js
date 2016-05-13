import Communities from '../../containers/onboarding/Communities'
import AwesomePeople from '../../containers/onboarding/AwesomePeople'
import ProfileHeader from '../../containers/onboarding/ProfileHeader'
import ProfileAvatar from '../../containers/onboarding/ProfileAvatar'
import ProfileBio from '../../containers/onboarding/ProfileBio'

export default [
  {
    path: 'onboarding/communities',
    getComponent(location, cb) {
      cb(null, Communities)
    },
  },
  {
    path: 'onboarding/awesome-people',
    getComponent(location, cb) {
      cb(null, AwesomePeople)
    },
  },
  {
    path: 'onboarding/profile-header',
    getComponent(location, cb) {
      cb(null, ProfileHeader)
    },
  },
  {
    path: 'onboarding/profile-avatar',
    getComponent(location, cb) {
      cb(null, ProfileAvatar)
    },
  },
  {
    path: 'onboarding/profile-bio',
    getComponent(location, cb) {
      cb(null, ProfileBio)
    },
  },
]

