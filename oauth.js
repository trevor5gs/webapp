// load env vars first in test
require('dotenv').load()

export default function addOauthRoute(app) {
  // Auth token
  // Get the access token object.
  const credentials = {
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    site: process.env.AUTH_DOMAIN,
    tokenPath: '/api/oauth/token',
    headers: {
      'Accept': 'application/json',
    },
  }

  // Initialize the OAuth2 Library
  const oauth2 = require('simple-oauth2')(credentials)
  const tokenConfig = { scope: 'public' }
  let token = null

  // Get the access token object for the client
  oauth2.client
    .getToken(tokenConfig)
    .then((result) => {
      if (result.errors) {
        console.log('Unable to get access token', result)
        process.exit(1)
      }
      token = oauth2.accessToken.create(result)
    })
    .catch((error) => {
      console.log('Access Token error getToken', error.message)
      process.exit(1)
    })

  app.get('/token', (req, res) => {
    if (token.expired()) {
      token.refresh().then((result) => {
        if (result.errors) {
          console.log('Access Token error token', result)
          res.status(401).send(result.errors)
        } else {
          token = result
          res.status(200).send(token)
        }
      }).catch((error) => {
        console.log('Access Token error catch token', error.message)
        res.status(401).send()
      })
    } else {
      res.status(200).send(token)
    }
  })
}
