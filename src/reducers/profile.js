import { camelizeKeys } from 'humps'
import jwtDecode from 'jwt-decode'
import get from 'lodash/get'
import { REHYDRATE } from 'redux-persist/constants'
import { AUTHENTICATION, INVITATIONS, PROFILE } from '../constants/action_types'

function parseJWT(token) {
  const decoded = jwtDecode(token)
  if (decoded && decoded.data) {
    return { ...(camelizeKeys(decoded.data)) }
  }
  return {}
}

export function profile(state = {}, action) {
  let assetState = null
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
      // keep around the registration data so that android
      // can re-register a user if they logout and then login
      // as a different user without leaving the app
      return {
        buildVersion: state.buildVersion,
        bundleId: state.bundleId,
        marketingVersion: state.marketingVersion,
        registrationId: state.registrationId,
      }
    case PROFILE.EXPORT_SUCCESS:
      if (action.payload.serverStatus === 200) {
        return { ...state, dataExport: action.payload.response.exportUrl }
      }
      return { ...state, dataExport: null }
    case PROFILE.LOAD_SUCCESS:
      assetState = {
        ...state,
        ...action.payload.response.users,
        id: `${action.payload.response.users.id}`,
      }
      return assetState
    case PROFILE.REQUEST_PUSH_SUBSCRIPTION:
      return {
        ...state,
        ...action.payload,
      }
    case PROFILE.SAVE_REQUEST:
      return {
        ...state,
        errors: null,
      }
    case PROFILE.SAVE_SUCCESS: {
      const obj = {
        ...state,
        ...action.payload.response.users,
        availability: null,
        id: `${action.payload.response.users.id}`,
      }
      if (state.avatar.tmp) {
        obj.avatar.tmp = state.avatar.tmp
      }
      if (state.coverImage.tmp) {
        obj.coverImage.tmp = state.coverImage.tmp
      }
      return obj
    }
    // should only happen if we get a 422 meaning
    // the current password entered was wrong
    case PROFILE.SAVE_FAILURE:
      return {
        ...state,
        errors: get(action, 'payload.response.errors'),
      }
    // Store a base64 reprensentation of the asset in `tmp` while uploading
    case PROFILE.TMP_AVATAR_CREATED:
    case PROFILE.TMP_COVER_CREATED: {
      const { type } = action
      const assetType = type === PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
      const key = type === PROFILE.TMP_AVATAR_CREATED ? 'hasAvatarPresent' : 'hasCoverImagePresent'
      return {
        ...state,
        [assetType]: { ...state[assetType], ...action.payload },
        [key]: true,
      }
    }
    case REHYDRATE:
      if (!action.payload.profile) { return state }
      assetState = {
        ...action.payload.profile,
        availability: null,
        dataExport: null,
      }
      if (get(assetState, 'avatar.tmp')) {
        delete assetState.avatar.tmp
      }
      if (get(assetState, 'coverImage.tmp')) {
        delete assetState.coverImage.tmp
      }
      return assetState
    case PROFILE.SAVE_AVATAR_SUCCESS:
    case PROFILE.SAVE_COVER_SUCCESS:
      assetState = {
        ...state,
        ...action.payload.response.users,
      }
      if (state.avatar.tmp) {
        assetState.avatar = { ...action.payload.response.users.avatar, tmp: state.avatar.tmp }
      }
      if (state.coverImage.tmp) {
        assetState.coverImage = {
          ...action.payload.response.users.coverImage, tmp: state.coverImage.tmp,
        }
      }
      return assetState
    case AUTHENTICATION.USER_SUCCESS:
    case AUTHENTICATION.REFRESH_SUCCESS:
    case PROFILE.SIGNUP_SUCCESS:
      return {
        ...state,
        ...parseJWT(action.payload.response.accessToken),
      }
    case INVITATIONS.GET_EMAIL_SUCCESS:
      return {
        ...state,
        email: get(action, 'payload.response.invitations.email'),
      }
    default:
      return state
  }
}

export default profile

