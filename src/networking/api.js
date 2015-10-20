const API_VERSION = 'v2'
const PROTOCOL = 'https'
const DOMAIN = (typeof ENV !== 'undefined') ? ENV.AUTH_DOMAIN : 'ello-staging.herokuapp.com'
const PER_PAGE = 20

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
export function s3CredentialsPath() {
  return {
    path: getAPIPath('assets/credentials'),
  }
}
// Current User Profile
export function profilePath() {
  return {
    path: getAPIPath('profile'),
  }
}
// Onboarding
export function awesomePeoplePath() {
  const params = { per_page: PER_PAGE }
  return {
    path: getAPIPath('discover/users/onboarding', params),
    params,
  }
}
export function communitiesPath() {
  const params = { name: 'onboarding', per_page: PER_PAGE }
  return {
    path: getAPIPath('interest_categories/members', params),
    params,
  }
}
export function relationshipBatchPath() {
  return {
    path: getAPIPath('relationships/batches'),
  }
}
// Discover
export function discoverRecommended() {
  const params = { per_page: PER_PAGE, include_recent_posts: true, seed: new Date().getTime() }
  return {
    path: getAPIPath('discover/users/recommended', params),
    params,
  }
}
// Streams
export function friendStream() {
  const params = { per_page: PER_PAGE }
  return {
    path: getAPIPath('streams/friend', params),
    params,
  }
}
export function noiseStream() {
  const params = { per_page: PER_PAGE }
  return {
    path: getAPIPath('streams/noise', params),
    params,
  }
}
// Posts
export function postDetail(idOrToken) {
  const params = { comment_count: PER_PAGE }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
    pagingPath: 'comments',
    params,
  }
}
// Comments
export function commentsForPost(post) {
  const params = { per_page: PER_PAGE }
  return {
    path: getAPIPath(`posts/${post.id}/comments`, params),
    params,
  }
}
// Users
export function userDetail(idOrUsername) {
  const params = { post_count: PER_PAGE }
  return {
    path: getAPIPath(`users/${idOrUsername}`, params),
    pagingPath: 'posts',
    params,
  }
}
// Search
export function searchPosts(params) {
  return {
    path: getAPIPath('posts', params),
    params,
  }
}
export function searchUsers(params) {
  return {
    path: getAPIPath('users', params),
    params,
  }
}

export { API_VERSION, getAPIPath, PER_PAGE }

