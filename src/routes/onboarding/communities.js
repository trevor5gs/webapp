export default {
  path: 'communities',
  subComponentName: 'CommunityPicker',

  getComponents(cb) {
    require.ensure([], (require) => {
      cb(null, require('../../components/views/OnboardingView'))
    })
  },
}

