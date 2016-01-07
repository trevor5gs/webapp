function getRoute(path, subComponentName) {
  return {
    path,
    subComponentName,
    getComponents(location, cb) {
      cb(null, require('../../containers/onboarding/Onboarding').default)
    },
  }
}

export default {
  path: 'onboarding',
  getChildRoutes(location, cb) {
    cb(null, [
      getRoute('communities', 'CommunityPicker'),
      getRoute('awesome-people', 'PeoplePicker'),
      getRoute('profile-header', 'CoverPicker'),
      getRoute('profile-avatar', 'AvatarPicker'),
      getRoute('profile-bio', 'InfoPicker'),
    ])
  },
}

