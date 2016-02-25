/* eslint-disable */
import { EMOJI } from '../constants/action_types'

export function emoji(state = {}, action) {
  switch (action.type) {
    case EMOJI.LOAD_SUCCESS:
      return { ...action.payload.response }
    default:
      return state
  }
}

