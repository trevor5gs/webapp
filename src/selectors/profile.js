import { createSelector } from 'reselect'
import { get } from 'lodash'

export const selectAvatar = (state) => get(state, 'profile.avatar')
export const selectCoverImage = (state) => get(state, 'profile.coverImage')
export const selectCreatedAt = (state) => get(state, 'profile.createdAt')
export const selectExternalLinksList = (state) => get(state, 'profile.externalLinksList', [])
export const selectId = (state) => get(state, 'profile.id')
export const selectName = (state) => get(state, 'profile.name', '')
export const selectShortBio = (state) => get(state, 'profile.shortBio', '')
export const selectUsername = (state) => get(state, 'profile.username')

// Memoized Selectors

export const selectIsAvatarBlank = createSelector(
  [selectAvatar], (avatar) => !(avatar && (avatar.tmp || avatar.original))
)

export const selectIsCoverImageBlank = createSelector(
  [selectCoverImage], (coverImage) => !(coverImage && (coverImage.tmp || coverImage.original))
)

export const selectIsInfoFormBlank = createSelector(
  [selectExternalLinksList, selectName, selectShortBio], (externalLinksList, name, shortBio) => {
    const hasLinks = externalLinksList && externalLinksList.length
    const hasName = name && name.length
    const hasShortBio = shortBio && shortBio.length
    return !hasLinks && !hasName && !hasShortBio
  }
)

export const selectLinksAsText = createSelector(
  [selectExternalLinksList], (externalLinksList) => {
    const links = externalLinksList || ''
    if (typeof links === 'string') {
      return links
    }
    return links.map((link) => link.text).join(', ')
  }
)

