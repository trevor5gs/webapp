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
export const s3CredentialsPath = getAPIPath('assets/credentials')
// Current User Profile
export const profilePath = getAPIPath('profile')
// Onboarding
export const awesomePeoplePath = getAPIPath('discover/users/onboarding', { per_page: '25' })
export const communitiesPath = getAPIPath('interest_categories/members', { name: 'onboarding', per_page: '25' })
export const relationshipBatchPath = getAPIPath('relationships/batches')
// Discover
export const discoverRecommended = getAPIPath('users/~lucian', { post_count: '40' })
export const friendStream = getAPIPath('streams/friend', { per_page: '40' })

export { API_VERSION, getAPIPath }
