import { PROMOTIONS } from '../constants/action_types'
import {
  authenticationPromo,
  loggedInPromo,
  loggedOutPromo,
} from '../networking/api'

export const fetchAuthenticationPromos = () => ({
  type: PROMOTIONS.AUTHENTICATION,
  payload: {
    endpoint: authenticationPromo(),
  },
})

export const fetchLoggedInPromos = () => ({
  type: PROMOTIONS.LOGGED_IN,
  payload: {
    endpoint: loggedInPromo(),
  },
})

export const fetchLoggedOutPromos = () => ({
  type: PROMOTIONS.LOGGED_OUT,
  payload: {
    endpoint: loggedOutPromo(),
  },
})
