import _ from 'lodash'
import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, PROFILE } from '../constants/action_types'

export function profile(state = {}, action) {
  let assetState = null
  let assetType = null
  switch (action.type) {
    case PROFILE.AVAILABILITY_SUCCESS:
      return {
        ...state,
        ...{
          availability: {
            original: action.meta.original,
            ...action.payload.response.availability,
          },
        },
      }
    case AUTHENTICATION.LOGOUT:
    case PROFILE.DELETE_SUCCESS:
      return {}
    case PROFILE.EXPORT_SUCCESS:
      if (action.payload.serverResponse.status === 200) {
        return { ...state, dataExport: action.payload.response.exportUrl }
      }
      return { ...state, dataExport: null }
    case PROFILE.LOAD_SUCCESS:
      assetState = {
        ...state,
        ...action.payload.response.users,
        id: `${action.payload.response.users.id}`,
      }
      delete assetState.avatar.tmp
      delete assetState.coverImage.tmp
      return assetState
    case PROFILE.SAVE_REQUEST:
      return {
        ...state,
        errors: null,
      }
    case PROFILE.SAVE_SUCCESS:
      return {
        ...state,
        ...action.payload.response,
        availability: null,
        id: `${action.payload.response.id}`,
      }
    // should only happen if we get a 422 meaning
    // the current password entered was wrong
    case PROFILE.SAVE_FAILURE:
      return {
        ...state,
        errors: _.get(action, 'payload.response.errors'),
      }
    // Store a base64 reprensentation of the asset in `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED:
      assetType = action.type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      return {
        ...state,
        [assetType]: { ...state[assetType], ...action.payload },
      }
    case REHYDRATE:
      return { ...action.payload.profile, availability: null, dataExport: null }
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS:
      assetType = action.type === PROFILE.SAVE_AVATAR_SUCCESS ? 'avatar' : 'coverImage'
      return {
        ...state,
        [assetType]: { ...state[assetType], tmp: { url: action.payload.response.assetUrl } },
      }
    default:
      return state
  }
}

