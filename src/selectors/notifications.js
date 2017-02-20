import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { ANNOUNCEMENTS } from '../constants/mapping_types'

export const selectAnnouncements = state => state.json.get(ANNOUNCEMENTS, Immutable.Map())

export const selectAnnouncement = createSelector(
  [selectAnnouncements], announcements =>
    (announcements.size && announcements.first()) || Immutable.Map(),
)

export const selectAnnouncementBody = createSelector(
  [selectAnnouncement], announcement => announcement.get('body'),
)

export const selectAnnouncementCTACaption = createSelector(
  [selectAnnouncement], announcement => announcement.get('ctaCaption', 'Learn More'),
)

export const selectAnnouncementCTAHref = createSelector(
  [selectAnnouncement], announcement => announcement.get('ctaHref'),
)

export const selectAnnouncementId = createSelector(
  [selectAnnouncement], announcement => announcement.get('id'),
)

export const selectAnnouncementImage = createSelector(
  [selectAnnouncement], announcement => announcement.getIn(['image', 'hdpi', 'url']),
)

export const selectAnnouncementTitle = createSelector(
  [selectAnnouncement], announcement => announcement.get('header'),
)

export const selectAnnouncementIsEmpty = createSelector(
  [selectAnnouncement], announcement => announcement.isEmpty(),
)

export const selectAnnouncementIsUnread = createSelector(
  [selectAnnouncements], announcements => !!(announcements && announcements.size),
)

