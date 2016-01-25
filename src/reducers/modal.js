import { MODAL, ALERT } from '../constants/action_types'

const initialState = {
  classList: null,
  component: null,
  isActive: false,
  kind: 'Modal',
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case MODAL.OPEN:
    case MODAL.CLOSE:
    case ALERT.OPEN:
    case ALERT.CLOSE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

