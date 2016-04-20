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
  oauth2.client
    .getToken(tokenConfig)
    .then((result) => {
      if (result.errors) {
        console.log('Unable to get access token', result)
        process.exit(1)
      }
      token = oauth2.accessToken.create(result)
      callback()
    })
    .catch((error) => {
      console.log('Access Token error getToken', error.message)
      process.exit(1)
    })
}

export function addOauthRoute(app) {
  app.get('/api/webapp-token', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '0')
    if (!token || token.expired()) {
      oauth2.client
        .getToken(tokenConfig)
        .then((result) => {
          if (result.errors) {
            console.log('Unable to get access token', result)
            process.exit(1)
          }
          token = oauth2.accessToken.create(result)
          res.status(200).send(token)
        })
        .catch((error) => {
          console.log('Access Token error getToken', error.message)
          process.exit(1)
        })
      // we don't have a refresh token for client credentials
      // token.refresh().then((result) => {
      //   if (result.errors) {
      //     console.log('Access Token error token', result)
      //     res.status(401).send(result.errors)
      //   } else {
      //     token = result
      //     res.status(200).send(token)
      //   }
      // }).catch((error) => {
      //   console.log('Access Token error catch token', error.message)
      //   res.status(401).send()
      // })
    } else {
      res.status(200).send(token)
    }
  })
}
