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
    type: ACTION_TYPES.EDITOR.TMP_IMAGE_CREATED,
    meta: {},
    payload: {
      url: objectURL,
      editorId,
    },
  }
}

export const editor = store => next => action => {
  const { payload, type } = action
  if (type === ACTION_TYPES.EDITOR.SAVE_ASSET) {
    const editorId = get(payload, 'editorId')
    const file = get(payload, 'file')

    // The - 2 should always be consistent. The reason is that when a tmp image
    // gets created at say uid 1 an additional text block is added to the bottom
    // of the editor at uid 2 and the uid of the editor is now sitting at 3
    // since it gets incremented after a block is added. So the - 2 gets us from
    // the 3 back to the 1 where the image should reconcile back to.
    if (editorId && file) {
      store.dispatch(temporaryPostImageCreated(URL.createObjectURL(file), editorId))
      const uid = store.getState().editor[editorId].uid - 2
      store.dispatch(uploadAsset(ACTION_TYPES.EDITOR.SAVE_IMAGE, file, editorId, uid))
    }
  }
  return next(action)
}

