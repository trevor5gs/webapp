const API_VERSION = 'v2'
const PROTOCOL = 'https'
const DOMAIN = (typeof ENV !== 'undefined') ? ENV.AUTH_DOMAIN : 'ello-staging.herokuapp.com'

function getAPIPath(relPath, queryParams = {}) {
  let path = `${PROTOCOL}://${DOMAIN}/api/${API_VERSION}/${relPath}`
  const queryArr = []
  for (const param in queryParams) {
    if (queryParams.hasOwnProperty(param)) {
      queryArr.push(`${param}=${queryParams[param]}`)
    }
  }
  if (queryArr.length) {
    path = `${path}?${queryArr.join('&')}`
  }
  return path
}

// Assets
export const s3CredentialsPath = {
  path: getAPIPath('assets/credentials'),
}
// Current User Profile
export const profilePath = {
  path: getAPIPath('profile'),
}
// Onboarding
export const awesomePeoplePath = {
  path: getAPIPath('discover/users/onboarding', { per_page: '25' }),
}
export const communitiesPath = {
  path: getAPIPath('interest_categories/members', { name: 'onboarding', per_page: '25' }),
}
export const relationshipBatchPath = {
  path: getAPIPath('relationships/batches'),
}
// Discover
export const discoverRecommended = {
  path: getAPIPath('users/~lucian', { post_count: '40' }),
  pagingPath: 'posts',
}
// Streams
export const friendStream = {
  path: getAPIPath('streams/friend', { per_page: '40' }),
}
// Posts
export function postDetail(idOrToken) {
  let path = ''
  if (parseInt(idOrToken, 10) > 0) {
    path = getAPIPath(`posts/${idOrToken}`, { comment_count: 20 })
  } else {
    path = getAPIPath(`posts/~${idOrToken}`, { comment_count: 20 })
  }
  return {
    path: path,
    pagingPath: 'comments',
  }
}
// Comments
export function commentsForPost(post) {
  return {
    path: getAPIPath(`posts/${post.id}/comments`, { per_page: 20 }),
  }
}
// Users
export function userDetail(idOrUsername) {
  let path = ''
  if (parseInt(idOrUsername, 10) > 0) {
    path = getAPIPath(`users/${idOrUsername}`, { post_count: 20 })
  } else {
    path = getAPIPath(`users/~${idOrUsername}`, { post_count: 20 })
  }
  return {
    path: path,
    pagingPath: 'posts',
  }
}

export { API_VERSION, getAPIPath }
