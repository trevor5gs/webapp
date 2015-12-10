import * as ACTION_TYPES from '../constants/action_types'
import * as api from '../networking/api'
import * as ENV from '../../env'

export function getClientCredentials(type) {
  return {
    type: ACTION_TYPES.AUTHENTICATION.CLIENT,
    payload: {
      endpoint: api.clientAccessToken(),
      method: 'POST',
      body: {
        client_id: ENV.AUTH_CLIENT_ID.replace(/"/g, ''),
        client_secret: ENV.AUTH_CLIENT_SECRET.replace(/"/g, ''),
        grant_type: 'client_credentials',
      },
    },
  }
}

