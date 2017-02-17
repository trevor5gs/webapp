import OnboardingCategoriesContainer from '../../containers/OnboardingCategoriesContainer'
import OnboardingCollaborateContainer from '../../containers/OnboardingCollaborateContainer'
import OnboardingInvitationsContainer from '../../containers/OnboardingInvitationsContainer'
import OnboardingSettingsContainer from '../../containers/OnboardingSettingsContainer'

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
    path: 'onboarding/collaborate',
    getComponent(location, cb) {
      cb(null, OnboardingCollaborateContainer)
    },
  },
  {
    path: 'onboarding/invitations',
    getComponent(location, cb) {
      cb(null, OnboardingInvitationsContainer)
    },
  },
]

