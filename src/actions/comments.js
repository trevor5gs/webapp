import * as ACTION_TYPES from '../constants/action_types'
import * as api from '../networking/api'

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

