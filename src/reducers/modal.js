import { MODAL, ALERT } from '../constants/action_types'

const initialState = {
  isActive: false,
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case MODAL.OPEN:
    case MODAL.CLOSE:
    case ALERT.OPEN:
    case ALERT.CLOSE:
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

