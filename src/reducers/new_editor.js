
import { get } from 'lodash'
import {
  AUTHENTICATION,
  EDITOR,
  POST,
  PROFILE,
} from '../constants/action_types'
import EditorHelper from '../helpers/editor_helper'

const editorHelper = new EditorHelper()
const initialState = {}

const initialEditorState = {
  collection: {
    0: {
      kind: 'text',
      uid: 0,
      data: '',
    },
  },
  completions: {},
  hasContent: false,
  loadedContent: {},
  order: [0],
  uid: 0,
}

// TODO:
// hook up dragging
// hook up has content
// hook up image loaders
// hook up cancel
// hook up clear block x button
// hook up paste of images/text

function editorObject(state = initialEditorState, action) {
  let newState = { ...state }
  const { collection, order } = newState
  const textBlocks = order.filter((orderUid) => collection[orderUid].kind === 'text')
  const lastTextBlock = collection[textBlocks[textBlocks.length - 1]]

  switch (action.type) {
    case EDITOR.APPEND_TEXT:
      // find last text block
      // += the text returned on the data
      if (lastTextBlock) {
        lastTextBlock.data += action.payload.text
        collection[lastTextBlock.uid] = lastTextBlock
      }
      return newState
    case POST.TMP_IMAGE_CREATED:
      // remove text block
      newState = editorHelper.removeEmptyTextBlock(newState)
      newState = editorHelper.add({
        block: {
          kind: 'image',
          data: { url: action.payload.url },
          isLoading: true,
        },
        state: newState,
      })
      return newState
    case POST.POST_PREVIEW_SUCCESS:
    case POST.SAVE_IMAGE_SUCCESS:
      newState.collection[action.payload.uid] = {
        ...newState.collection[action.payload.uid],
        data: { url: action.payload.response.url },
        isLoading: false,
      }
      return newState
    case POST.PERSIST:
      return { ...state, ...action.payload }
    case POST.CREATE_SUCCESS:
      return {}
    // case REHYDRATE:
    //   for (const editor in action.payload.editor) {
    //     // TODO: only keep ones that should persist
    //   }
    default:
      return state
  }
}

export function editor(state = initialState, action) {
  const newState = { ...state }
  const editorId = get(action, 'payload.editorId')
  if (editorId) {
    newState[editorId] = editorObject(newState[editorId], action)
    if (action.type === 'INIT_EDITOR_ID') {
      newState[editorId].shouldPersist = get(action, 'payload.shouldPersist', false)
    }
    return newState
  } else if (action.type === AUTHENTICATION.LOGOUT ||
             action.type === PROFILE.DELETE_SUCCESS) {
    return { ...initialState }
  }
  return state
}

