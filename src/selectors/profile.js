import { createSelector } from 'reselect'
import { get } from 'lodash'

/* eslint-disable max-len */
export const selectAvatar = (state) => get(state, 'profile.avatar')
export const selectCoverImage = (state) => get(state, 'profile.coverImage')
export const selectCreatedAt = (state) => get(state, 'profile.createdAt')
export const selectExternalLinksList = (state) => get(state, 'profile.externalLinksList', [])
export const selectHasAvatarPresent = (state) => get(state, 'profile.hasAvatarPresent', false)
export const selectHasCoverImagePresent = (state) => get(state, 'profile.hasCoverImagePresent', false)
export const selectId = (state) => get(state, 'profile.id')
export const selectName = (state) => get(state, 'profile.name', '')
export const selectShortBio = (state) => get(state, 'profile.shortBio', '')
export const selectUsername = (state) => get(state, 'profile.username')
/* eslint-enable max-len */

// Memoized Selectors

export const selectIsAvatarBlank = createSelector(
  [selectHasAvatarPresent, selectAvatar], (hasAvatarPresent, avatar) =>
    !hasAvatarPresent || !(avatar && (avatar.tmp || avatar.original))
)

export const selectIsCoverImageBlank = createSelector(
  [selectHasCoverImagePresent, selectCoverImage], (hasCoverImagePresent, coverImage) =>
    !hasCoverImagePresent || !(coverImage && (coverImage.tmp || coverImage.original))
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

