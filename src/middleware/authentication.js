import { REHYDRATE } from 'redux-persist/constants'
import {
  refreshAuthenticationToken,
  scheduleAuthRefresh,
} from '../actions/authentication'
import {
  pauseRequester,
  unpauseRequester,
} from '../actions/api'

import { AUTHENTICATION, PROFILE } from '../constants/action_types'

const toMilliseconds = seconds => seconds * 1000

// Get a timeout value about 100ms before a given date,
// or at least not in the past
const futureTimeout = time => {
  let msFromNow = time - new Date()

  // Establish a lead time of 100ms before expiration date
  msFromNow = msFromNow - 100

  // Let's not set a timeout for in the past
  return Math.max(msFromNow, 0)
}

export const authentication = store => next => action => {
  const { payload, type } = action
  let result = null
  switch (type) {
    case REHYDRATE:
      if (payload.authentication) {
        const { createdAt, expiresIn, refreshToken } = payload.authentication

        if (!refreshToken) break

        const now = new Date()
        const expirationDate = new Date(toMilliseconds(createdAt + expiresIn))

        if (expirationDate < now) {
          store.dispatch(refreshAuthenticationToken(refreshToken))
        } else {
          const newTimeout = futureTimeout(expirationDate)

          store.dispatch(scheduleAuthRefresh(refreshToken, newTimeout))
        }
      }

      break
    case AUTHENTICATION.USER_REQUEST:
    case AUTHENTICATION.REFRESH_REQUEST:
      result = next(action)
      store.dispatch(pauseRequester())
      return result
    case AUTHENTICATION.REFRESH_SUCCESS:
    case AUTHENTICATION.USER_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
      result = next(action)
      store.dispatch(unpauseRequester())
      store.dispatch(scheduleAuthRefresh(
        payload.response.refreshToken,
        toMilliseconds(7100)
      ))
      return result
    case AUTHENTICATION.USER_FAILURE:
      result = next(action)
      store.dispatch(unpauseRequester())
      return result
    default:
      break
  }

  return next(action)
}

