const API_VERSION = 'v2'
const PER_PAGE = 20
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
export function forgotPassword() {
  return {
    path: getAPIPath('forgot-password'),
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
  const params = { comment_count: PER_PAGE }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
    pagingPath: 'comments',
    params,
  }
}
export function editPostDetail(idOrToken) {
  const params = { comment_count: false }
  return {
    path: getAPIPath(`posts/${idOrToken}`, params),
    params,
  }
}
// Loves
export function lovePost(post) {
  return {
    path: getAPIPath(`posts/${post.id}/loves`),
  }
}
export function unlovePost(post) {
  return {
    path: getAPIPath(`posts/${post.id}/love`),
  }
}
export function deletePost(post) {
  return {
    path: getAPIPath(`posts/${post.id}`),
  }
}
export function flagPost(post, kind) {
  return {
    path: getAPIPath(`posts/${post.id}/flag/${kind}`),
  }
}
export function postLovers(post) {
  const params = { per_page: 10 }
  return {
    path: getAPIPath(`posts/${post.id}/lovers`),
    params,
  }
}
export function postReposters(post) {
  const params = { per_page: 10 }
  return {
    path: getAPIPath(`posts/${post.id}/reposters`),
    params,
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
export function updatePost(post) {
  return {
    path: getAPIPath(`posts/${post.id}`),
  }
}
export function postPreviews() {
  return {
    path: getAPIPath('post_previews'),
  }
}
export function userAutocompleter(word) {
  return {
    path: getAPIPath('users/autocomplete', { terms: word.replace(/@|:/ig, '') }),
  }
}
export function loadEmojis() {
  return {
    path: `${ENV.AUTH_DOMAIN}/emojis.json`,
  }
}
// Comments
export function commentsForPost(post) {
  const params = { per_page: 10 }
  return {
    path: getAPIPath(`posts/${post.id}/comments`, params),
    params,
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
    params,
  }
}
export function userResources(idOrUsername, resource) {
  const params = { per_page: PER_PAGE }
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

// RELATIONSHIPS
export function relationshipAdd(userId, priority) {
  return {
    path: getAPIPath(`users/${userId}/add/${priority}`),
  }
}

export { API_VERSION, getAPIPath, PER_PAGE }

