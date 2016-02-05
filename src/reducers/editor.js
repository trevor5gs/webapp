import { POST } from '../constants/action_types'

export function editor(state = {}, action) {
  let obj
  switch (action.type) {
    case POST.CREATE_SUCCESS:
      return {}
    case POST.TMP_IMAGE_CREATED:
      return {
        ...state,
        type: action.type,
        ...action.payload,
      }
    case POST.IMAGE_BLOCK_CREATED:
      return {
        ...state,
        type: action.type,
        ...action.payload,
      }
    case POST.POST_PREVIEW_SUCCESS:
    case POST.SAVE_IMAGE_SUCCESS:
      return {
        ...state,
        type: action.type,
        ...action.payload.response,
      }
    case POST.PERSIST:
      obj = {
        ...state,
        type: action.type,
      }
      if (action.payload) {
        obj.editorState = action.payload
      }
      return obj
    default:
      return state
  }
}

