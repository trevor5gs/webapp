const API_VERSION = 'v2'
const PER_PAGE = 25
const basePath = () => `${ENV.AUTH_DOMAIN}/api`

function getAPIPath(relPath, queryParams = {}) {
  let path = `${basePath()}/${API_VERSION}/${relPath}`
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
// Authentication
export function accessTokens() {
  return {
    path: `${basePath()}/oauth/token`,
  }
}

export function loginToken(email, password) {
  const params = { email, password }
  return {
    path: `${basePath()}/oauth/login`,
    params,
  }
}

export function logout() {
  return {
    path: `${basePath()}/oauth/logout`,
  }
}

export function forgotPassword() {
  return {
    path: getAPIPath('forgot-password'),
  }
}

export function refreshAuthToken(refreshToken) {
  const params = { refresh_token: refreshToken }
  return {
    path: `${basePath()}/oauth/refresh`,
    params,
  }
}

export function signupPath(email, username, password, invitationCode) {
  const params = { email, username, password, invitationCode }
  return {
    path: `${basePath()}/v2/signup`,
    params,
  }
}

// Current User Profile
export function profilePath() {
  return {
    path: getAPIPath('profile'),
  }
}
export function profileAvailableToggles() {
  return {
    path: getAPIPath('profile/available_toggles'),
  }
}
export function profileBlockedUsers() {
  return {
    path: getAPIPath('profile/blocked'),
  }
}
export function profileMutedUsers() {
  return {
    path: getAPIPath('profile/muted'),
  }
}
export function profileExport() {
  return {
    path: getAPIPath('profile/export'),
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
export function discoverUsers(type) {
  const params = { per_page: PER_PAGE, include_recent_posts: true }
  return {
    path: getAPIPath(`discover/users/${type}`, params),
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
  const params = { comment_count: false }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
  }
}
export function editPostDetail(idOrToken) {
  const params = { comment_count: false }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
  }
}
// Loves
export function lovePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/loves`),
  }
}
export function unlovePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/love`),
  }
}
export function deletePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}`),
  }
}
export function flagPost(idOrToken, kind) {
  return {
    path: getAPIPath(`posts/${idOrToken}/flag/${kind}`),
  }
}
export function postLovers(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/lovers`, { per_page: 10 }),
  }
}
export function postReposters(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}/reposters`, { per_page: 10 }),
  }
}
export function createPost(repostId) {
  const params = {}
  if (repostId) { params.repost_id = repostId }
  return {
    path: getAPIPath('posts', params),
    params,
  }
}
export function updatePost(idOrToken) {
  return {
    path: getAPIPath(`posts/${idOrToken}`),
  }
}
export function postPreviews() {
  return {
    path: getAPIPath('post_previews'),
  }
}
export function userAutocompleter(word) {
  return {
    path: getAPIPath('users/autocomplete', { terms: word.replace(/@|:/ig, ''), per_page: 10 }),
  }
}
export function loadEmojis() {
  return {
    path: `${ENV.AUTH_DOMAIN}/emojis.json`,
  }
}
// Comments
export function commentsForPost(idOrToken) {
  const params = { per_page: 10 }
  return {
    path: getAPIPath(`posts/${idOrToken}/comments`, params),
  }
}
export function createComment(postId) {
  return {
    path: getAPIPath(`posts/${postId}/comments`),
  }
}
export function editComment(comment) {
  return {
    path: getAPIPath(`posts/${comment.postId}/comments/${comment.id}`),
  }
}
export function deleteComment(comment) {
  return {
    path: getAPIPath(`posts/${comment.postId}/comments/${comment.id}`),
  }
}
export function flagComment(comment, kind) {
  return {
    path: getAPIPath(`posts/${comment.postId}/comments/${comment.id}/flag/${kind}`),
  }
}
// Users
export function userDetail(idOrUsername) {
  const params = { post_count: false }
  return {
    path: getAPIPath(`users/${idOrUsername}`, params),
  }
}
export function userFollowing(idOrUsername, priority) {
  const params = {
    per_page: 10,
  }

  if (priority) params.priority = priority

  return {
    path: getAPIPath(`users/${idOrUsername}/following`, params),
  }
}

export function userResources(idOrUsername, resource) {
  const params = { per_page: 10 }
  return {
    path: getAPIPath(`users/${idOrUsername}/${resource}`, params),
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
// Notifications
export function notifications(params = {}) {
  const newParams = { per_page: PER_PAGE, ...params }
  if (newParams.category && newParams.category === 'all') {
    delete newParams.category
  }
  return {
    path: getAPIPath('notifications', newParams),
    newParams,
  }
}
export function newNotifications() {
  return {
    path: getAPIPath('notifications'),
  }
}

// AVAILABILITY
export function availability() {
  return {
    path: getAPIPath('availability'),
  }
}

// INVITE
export function invite() {
  return {
    path: getAPIPath('invitations', { per_page: 100 }),
  }
}
export function getInviteEmail(code) {
  return {
    path: getAPIPath(`invitations/${code}`),
  }
}

// RELATIONSHIPS
export function relationshipAdd(userId, priority) {
  return {
    path: getAPIPath(`users/${userId}/add/${priority}`),
  }
}

export { API_VERSION, getAPIPath, PER_PAGE }

