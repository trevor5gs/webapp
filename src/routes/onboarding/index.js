import Communities from '../../containers/onboarding/Communities'
import AwesomePeople from '../../containers/onboarding/AwesomePeople'
import ProfileHeader from '../../containers/onboarding/ProfileHeader'
import ProfileAvatar from '../../containers/onboarding/ProfileAvatar'
import ProfileBio from '../../containers/onboarding/ProfileBio'
import OnboardingCategoriesContainer from '../../containers/OnboardingCategoriesContainer'
import OnboardingSettingsContainer from '../../containers/OnboardingSettingsContainer'
import OnboardingInvitationsContainer from '../../containers/OnboardingInvitationsContainer'

export default [
  {
    path: 'onboarding/categories',
    getComponent(location, cb) {
      cb(null, OnboardingCategoriesContainer)
    },
  },
  {
    path: 'onboarding/settings',
    getComponent(location, cb) {
      cb(null, OnboardingSettingsContainer)
    },
  },
  {
    path: 'onboarding/invitations',
    getComponent(location, cb) {
      cb(null, OnboardingInvitationsContainer)
    },
  },
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

