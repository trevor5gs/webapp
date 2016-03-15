/* eslint-disable max-len */
// These get set by the ResizeComponent
export const GUI = {
  innerWidth: null,
  innerHeight: null,
  columnWidth: null,
  contentWidth: null,
  coverOffset: null,
  coverImageSize: null,
  viewportDeviceSize: null,
  gridColumnCount: null,
}

export const SHORTCUT_KEYS = {
  DISCOVER: 'd',
  DT_CONTAINER_TOGGLE: 'g |',
  DT_GRID_CYCLE: 'g ~',
  DT_GRID_TOGGLE: 'g `',
  ESC: 'esc',
  FOLLOWING: 'f',
  FULLSCREEN: 'g m',
  HELP: '?',
  NOTIFICATIONS: 'r',
  OMNIBAR: '2',
  SEARCH: 's',
  STARRED: 'n',
  TOGGLE_LAYOUT: '=',
}

export const FORM_CONTROL_STATUS = {
  INDETERMINATE: 'FORM_CONTROL_STATUS.INDETERMINATE',
  REQUEST: 'FORM_CONTROL_STATUS.REQUEST',
  FAILURE: 'FORM_CONTROL_STATUS.FAILURE',
  SUCCESS: 'FORM_CONTROL_STATUS.SUCCESS',
  SUBMITTED: 'FORM_CONTROL_STATUS.SUBMITTED',
}

export const SETTINGS = {
  NSFW_DISCLAIMER: 'Note: Apple iOS rules block the sharing of NSFW content through iOS apps. Accounts & posts marked NSFW will not appear in search results on the Ello iOS App but will appear when using Ello on the web. If you want your posts to appear on Ello iOS, please set "Post Adult Content" to "No".',
  YOUR_DATA_DESC: 'The only data that Ello stores about you is what you enter on your settings page and what you post. All other usage data that we collect is anonymized, and you can opt out.',
  ACCOUNT_DELETION_DEFINITION: {
    term: 'Delete Account',
    desc: 'By deleting your account you remove your personal information from Ello. Your account cannot be restored.',
  },
}

export const PREFERENCES = {
  NSFW_VIEW: {
    term: 'View Adult Content',
    desc: '<a href="https://ello.co/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
  NSFW_POST: {
    term: 'Post Adult Content',
    desc: '<a href="https://ello.co/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
}

export const SESSION_KEYS = {
  NOTIFICATIONS_FILTER: 'KEYS.NOTIFICATIONS_FILTER',
  scrollLocationKey: (key) => `scrollLocations.${key}`,
}
