import _ from 'lodash/fp'
import { REHYDRATE } from 'redux-persist/constants'
import {
  refreshAuthenticationToken,
  scheduleAuthRefresh,
} from '../actions/authentication'
import * as ACTION_TYPES from '../constants/action_types'

const toMilliseconds = seconds => seconds * 1000

const fromNow = (time) => time - new Date()
const atLeastFifty = _.partial(Math.max, 50)
// Reverse arity, curried version of https://lodash.com/docs#subtract
const subtract = subtrahend => minuend => minuend - subtrahend

// Get a timeout value about 100ms before a given date,
// or 50ms from this moment if the given date is too close
const futureTimeout = _.pipe(
  fromNow,
  subtract(100),
  atLeastFifty
)

export const authentication = store => next => action => {
  const { payload, type } = action

  switch (type) {
    case REHYDRATE:
      if (action.key === 'authentication') {
        const { createdAt, expiresIn, refreshToken } = payload

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
    case ACTION_TYPES.AUTHENTICATION.REFRESH_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.USER_SUCCESS:
      store.dispatch(scheduleAuthRefresh(
        payload.response.refreshToken,
        toMilliseconds(7100)
      ))
      break
    default:
      break
  }

  next(action)
}
