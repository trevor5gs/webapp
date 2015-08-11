import { TEST, TEST_ASYNC } from '../constants/ActionTypes'

export default function communities(state={}, action) {
  switch (action.type) {
    case TEST:
    case TEST_ASYNC:
      return {
        ...state,
        "message" : action.message
      }
    default:
      return state
    }
}

