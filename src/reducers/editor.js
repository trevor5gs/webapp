import { POST, PROFILE } from '../constants/action_types'

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
    case POST.AUTO_COMPLETE_CLEAR:
      obj = {
        ...state,
        type: action.type,
      }
      delete obj.completions
      return obj
    case POST.AUTO_COMPLETE_SUCCESS:
      obj = {
        ...state,
        type: action.type,
      }
      if (action.payload && action.payload.response) {
        const { type = 'user' } = action.payload
        obj.completions = { data: action.payload.response.autocompleteResults, type }
      }
      return obj
    case PROFILE.DELETE_SUCCESS:
      return {}
    default:
      return state
  }
}

