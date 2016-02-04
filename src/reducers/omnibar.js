import { OMNIBAR } from '../constants/action_types'

const initialState = {
  classList: null,
  component: null,
  isActive: false,
}

export function omnibar(state = initialState, action) {
  switch (action.type) {
    case OMNIBAR.OPEN:
    case OMNIBAR.CLOSE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

