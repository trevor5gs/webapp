import React from 'react'

export const SHORTCUT_KEYS = {
  TOGGLE_LAYOUT: '=',
  HELP: '?',
  ESC: 'esc',
  SEARCH: 'g s',
  DISCOVER: 'g d',
  ONBOARDING: 'g 0',
  DT_GRID_TOGGLE: 'g `',
  DT_GRID_CYCLE: 'g ~',
  DT_CONTAINER_TOGGLE: 'g |',
}

export const BANDEROLES = [
  {
    username: 'ellobackcountry',
    caption: <h1>Create and share inspiration. Explore and post differently than you do anywhere else.</h1>,
    avatar: {
      regular: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/avatar/2548434/ello-regular-a2174f7b.png' },
    },
    coverImage: {
      hdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/2548434/ello-hdpi-abda0669.jpg' },
      xhdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/2548434/ello-xhdpi-abda0669.jpg' },
      optimized: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/2548434/ello-optimized-abda0669.jpg' },
    },
  },
  {
    username: 'velvetspectrum',
    caption: <h1>Say stuff out loud. And then say it louder. Then say it to yourself. Quietly.</h1>,
    avatar: {
      regular: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/avatar/930194/ello-regular-0c164258.png' },
    },
    coverImage: {
      hdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/930194/ello-hdpi-2407933e.jpg' },
      xhdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/930194/ello-xhdpi-2407933e.jpg' },
      optimized: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/930194/ello-optimized-2407933e.jpg' },
    },
  },
  {
    username: 'dalek',
    caption: <h1>Maps to the skater's homes! Maps to the skater's homes! Maps to the skater's homez?</h1>,
    avatar: {
      regular: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/avatar/271804/ello-regular-78805a22.png' },
    },
    coverImage: {
      hdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/271804/ello-hdpi-78805a22.jpg' },
      xhdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/271804/ello-xhdpi-78805a22.jpg' },
      optimized: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/271804/ello-optimized-78805a22.jpg' },
    },
  },
  {
    username: 'topodesigns',
    caption: <h1>Explore and post differently than you do anywhere else. Create and share inspiration.</h1>,
    avatar: {
      regular: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/avatar/13304/ello-regular-64f26a2e.png' },
    },
    coverImage: {
      hdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/13304/ello-hdpi-63f6600c.jpg' },
      xhdpi: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/13304/ello-xhdpi-63f6600c.jpg' },
      optimized: { url: 'https://d324imu86q1bqn.cloudfront.net/uploads/user/cover_image/13304/ello-optimized-63f6600c.jpg' },
    },
  },
]

// These get set by the ResizeComponent
export const GUI = {
  innerWidth: null,
  innerHeight: null,
  columnWidth: null,
  contentWidth: null,
  coverOffset: null,
  coverImageSize: null,
  viewportSetting: null,
  gridColumnCount: null,
}

