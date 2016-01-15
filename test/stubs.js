import * as MAPPING_TYPES from '../src/constants/mapping_types'

let json = {}

function clearJSON() {
  json = {}
}
const commonProps = {
  id: '1',
  createdAt: new Date(),
  href: 'href',
  links: {},
}

function addToJSON(collection, model) {
  if (!json[collection]) { json[collection] = {} }
  json[collection][model.id] = model
}

function stubAvatar() {
  return {
    original: {
      url: '',
    },
    large: {
      url: '',
      metadata: null,
    },
    regular: {
      url: '',
      metadata: null,
    },
    small: {
      url: '',
      metadata: null,
    },
  }
}

function stubCoverImage() {
  return {
    original: {
      url: '',
    },
    optimized: {
      url: '',
      metadata: null,
    },
  }
}

function stubUser(properties) {
  const defaultProps = {
    username: 'username',
    name: 'name',
    postsAdultContent: false,
    viewsAdultContent: true,
    hasCommentingEnabled: true,
    hasSharingEnabled: true,
    hasRepostingEnabled: true,
    hasLovesEnabled: true,
    experimentalFeatures: false,
    relationshipPriority: null,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    lovesCount: 0,
    formattedShortBio: '<p>Formatted Short Bio</p>',
    externalLinksList: [
      {
        url: 'http://www.google.com',
        text: 'google.com',
      },
    ],
    backgroundPosition: null,
    avatar: stubAvatar(),
    coverImage: stubCoverImage(),
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.USERS, model)
  return model
}

function stubTextRegion(properties) {
  const defaultProps = {
    kind: 'text',
    data: '<p>Text Region</p>',
  }
  return { ...defaultProps, ...properties }
}

function stubPost(properties) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    commentsCount: 0,
    content: [stubTextRegion()],
    contentWarning: null,
    isAdultContent: false,
    loved: false,
    lovesCount: 0,
    repostCount: 0,
    reposted: false,
    summary: [stubTextRegion()],
    token: 'token',
    viewsCount: 0,
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.POSTS, model)
  return model
}

function stubComment(properties) {
  const defaultProps = {
    authorId: 'authorId',
    body: [],
    content: [stubTextRegion()],
    postId: '1',
    summary: [stubTextRegion()],
  }
  const model = { ...commonProps, ...defaultProps, ...properties }
  addToJSON(MAPPING_TYPES.COMMENTS, model)
  return model
}

export function stub(model, properties) {
  switch (model.toLowerCase()) {
    case 'comment':
      return stubComment(properties)
    case 'post':
      return stubPost(properties)
    case 'user':
      return stubUser(properties)
    default:
      return null
  }
}

export { clearJSON, json, stubPost, stubTextRegion, stubUser }

