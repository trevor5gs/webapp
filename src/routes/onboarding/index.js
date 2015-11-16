function getRoute(path, subComponentName) {
  return {
    path: path,
    subComponentName: subComponentName,
    getComponents(location, cb) {
      // require.ensure([], (require) => {
      cb(null, require('../../containers/Onboarding'))
      // })
    },
  }
}

export default {
  path: 'onboarding',
  getChildRoutes(location, cb) {
    // require.ensure([], () => {
    cb(null, [
      getRoute('communities', 'CommunityPicker'),
      getRoute('awesome-people', 'PeoplePicker'),
      getRoute('profile-header', 'CoverPicker'),
      getRoute('profile-avatar', 'AvatarPicker'),
      getRoute('profile-bio', 'InfoPicker'),
    ])
    // })
  },
}

