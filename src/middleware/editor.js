import * as ACTION_TYPES from '../constants/action_types'
import { get } from 'lodash'

function uploadAsset(type, file, editorId, uid) {
  return {
    type,
    meta: {},
    payload: {
      editorId,
      file,
      uid,
    },
  }
}

function temporaryPostImageCreated(objectURL, editorId) {
  return {
    type: ACTION_TYPES.POST.TMP_IMAGE_CREATED,
    meta: {},
    payload: {
      url: objectURL,
      editorId,
    },
  }
}

export const editor = store => next => action => {
  const { payload, type } = action
  if (type === ACTION_TYPES.POST.SAVE_ASSET) {
    const editorId = get(payload, 'editorId')
    const file = get(payload, 'file')

    if (editorId && file) {
      store.dispatch(temporaryPostImageCreated(URL.createObjectURL(file), editorId))
      const uid = store.getState().editor[editorId].uid - 1
      store.dispatch(uploadAsset(ACTION_TYPES.POST.SAVE_IMAGE, file, editorId, uid))
    }
  }
  return next(action)
}

