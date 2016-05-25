import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import { resetEditor } from '../actions/editor'

export function createComment(body, editorId, postId) {
  return {
    type: ACTION_TYPES.COMMENT.CREATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.createComment(postId),
      method: 'POST',
      postId,
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      successAction: resetEditor(editorId),
    },
  }
}

export function deleteComment(comment) {
  return {
    type: ACTION_TYPES.COMMENT.DELETE,
    payload: {
      endpoint: api.deleteComment(comment),
      method: 'DELETE',
      model: comment,
    },
    meta: {},
  }
}

export function flagComment(comment, kind) {
  return {
    type: ACTION_TYPES.COMMENT.FLAG,
    payload: {
      endpoint: api.flagComment(comment, kind),
      method: 'POST',
    },
    meta: {},
  }
}

export function loadEditableComment(comment) {
  return {
    type: ACTION_TYPES.COMMENT.EDITABLE,
    payload: { endpoint: api.editComment(comment) },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      updateResult: false,
    },
  }
}

export function toggleEditing(comment, isEditing) {
  return {
    type: ACTION_TYPES.COMMENT.TOGGLE_EDITING,
    payload: {
      model: comment,
      isEditing,
    },
  }
}

export function updateComment(comment, body, editorId) {
  return {
    type: ACTION_TYPES.COMMENT.UPDATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.editComment(comment),
      method: 'PATCH',
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
    },
  }
}

