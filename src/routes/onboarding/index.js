import OnboardingCategoriesContainer from '../../containers/OnboardingCategoriesContainer'
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
    path: 'onboarding/invitations',
    getComponent(location, cb) {
      cb(null, OnboardingInvitationsContainer)
    },
  },
]

