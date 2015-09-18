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

export const communitiesPath = getAPIPath('interest_categories/members', { name: 'onboarding', per_page: '20' })
export const awesomePeoplePath = getAPIPath('discover/users/onboarding', { per_page: '20' })
export const relationshipBatchPath = getAPIPath('relationships/batches')
export const profilePath = getAPIPath('profile')
export const s3CredentialsPath = getAPIPath('assets/credentials')

export { getAPIPath, API_VERSION, PROTOCOL, DOMAIN }
