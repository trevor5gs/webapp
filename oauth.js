// load env vars first
require('dotenv').load({ silent: process.env.NODE_ENV === 'production' })

// Auth token
// Get the access token object.
const credentials = {
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  site: process.env.AUTH_DOMAIN,
  tokenPath: '/api/oauth/token',
  headers: {
    Accept: 'application/json',
  },
}

// Initialize the OAuth2 Library
const oauth2 = require('simple-oauth2')(credentials)
const tokenConfig = { scope: 'public scoped_refresh_token' }
let token = null

export function fetchOauthToken(callback) {
  // Get the access token object for the client
  currentToken().then(() => {
    callback()
  })
}

export function addOauthRoute(app) {
  app.get('/api/webapp-token', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '0')
    currentToken().then((token) => {
      res.status(200).send(token)
    })
  })
}

export function currentToken() {
  if (!token || token.expired()) {
    return new Promise((resolve) => {
      oauth2.client
      .getToken(tokenConfig)
      .then((result) => {
        if (result.errors) {
          console.log('Unable to get access token', result)
          process.exit(1)
        }
        token = oauth2.accessToken.create(result)
        resolve(token)
      }).catch((err) => {
          console.log('Unable to get access token', err)
          process.exit(1)
      })
    })
  }
  return new Promise((resolve) => { resolve(token) })
}
