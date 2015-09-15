const API_VERSION = 'v2'
const PROTOCOL = 'https'
const DOMAIN = ENV.AUTH_DOMAIN

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

export const channels = getAPIPath('interest_categories/members', { name: 'onboarding', per_page: '20' })

export { getAPIPath, API_VERSION, PROTOCOL, DOMAIN }
