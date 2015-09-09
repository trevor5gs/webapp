import { MODALS, ALERTS } from '../constants/action_types'

const initialState = {
  isActive: false,
}

export function modals(state = initialState, action) {
  switch (action.type) {

  case MODALS.OPEN:
  case MODALS.CLOSE:
  case ALERTS.OPEN:
  case ALERTS.CLOSE:
    return {
      type: action.type,
      error: action.error,
      meta: {
        ...state.meta,
        ...action.meta,
      },
      payload: action.payload,
    }

  default:
    return state
  }
}

