import { EDITOR } from '../constants/action_types'

export function emoji(state = {}, action) {
  switch (action.type) {
    case EDITOR.EMOJI_COMPLETER_SUCCESS:
      return { ...action.payload.response }
    default:
      return state
  }
}

export default emoji

