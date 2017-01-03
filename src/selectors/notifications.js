import { createSelector } from 'reselect'

export const selectAnnouncementCollection = state => state.json.announcements

export const selectAnnouncement = createSelector(
  [selectAnnouncementCollection], (collection) => {
    const key = collection ? Object.keys(collection)[0] : null
    if (key) {
      return collection[key]
    }
    return null
  },
)

