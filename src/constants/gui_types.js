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
  PREF_PUBLIC_PROFILE: {
    term: 'Public Profile',
    desc: 'Make my profile viewable by people outside of the Ello network.',
  },
  PREF_COMMENTS: {
    term: 'Comments',
    desc: 'Allow people to comment on my posts.',
  },
  PREF_LOVES: {
    term: 'Loves',
    desc: 'Allow people to love my posts.',
  },
  PREF_SHARING: {
    term: 'Sharing',
    desc: 'Allow people to share my posts.',
  },
  PREF_REPOSTING: {
    term: 'Reposting',
    desc: 'Allow people to repost my posts.',
  },
  PREF_EMBEDDED_MEDIA: {
    term: 'Embedded Media',
    desc: 'Warn me when media may contain 3rd party ads.',
  },
  PREF_ANALYTICS: {
    term: 'Analytics',
    desc: 'Allow Ello to gather anonymous information about your visit, which helps us make Ello better. <a href="https://ello.co/wtf/post/privacy" target="_blank">Learn more</a>.',
  },
  PREF_DISCOVERABILITY: {
    term: 'Discoverablility',
    desc: 'Let friends who have my e-mail address find me on Ello.',
  },
  MAIL_COMMENTS: {
    term: 'Comments',
    desc: 'Receive an e-mail when other people comment on your posts.',
  },
  MAIL_LOVES: {
    term: 'Loves',
    desc: 'Receive an e-mail when other people love your posts.',
  },
  MAIL_MENTIONS: {
    term: 'Mentions',
    desc: 'Receive an e-mail when other people mention you in a post.',
  },
  MAIL_REPOSTS: {
    term: 'Reposts',
    desc: 'Receive an e-mail when other people repost your posts.',
  },
  MAIL_NEW_FOLLOWERS: {
    term: 'New Followers',
    desc: 'Receive an e-mail when other people follow you.',
  },
  MAIL_INVITE_ACCEPTED: {
    term: 'Invitations',
    desc: 'Receive an e-mail when other people accept your invitations.',
  },
  NEWS_FEATURES: {
    term: 'News & Features',
    desc: 'Receive e-mails from Ello with service updates and feature announcements.',
  },
  NEWS_WEEKLY: {
    term: 'Weekly Ello',
    desc: 'Receive a weekly curated e-mail of inspiring Ello posts.',
  },
  NEWS_DAILY: {
    term: 'Daily Ello',
    desc: 'Receive a daily curated e-mail of inspiring Ello posts.',
  },
  NEWS_TIPS: {
    term: 'Tips for Getting Started',
    desc: 'Receive e-mails with tips and tricks on how to use Ello.',
  },
  NSFW_VIEW: {
    term: 'View Adult Content',
    desc: '<a href="https://ello.co/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
  NSFW_POST: {
    term: 'Post Adult Content',
    desc: '<a href="https://ello.co/wtf/post/rules" target="_blank">What does this mean?</a>',
  },
}
