import { camelizeKeys } from 'humps'
import jwtDecode from 'jwt-decode'
import _ from 'lodash'
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
    case PROFILE.SAVE_SUCCESS:
      return {
        ...state,
        ...action.payload.response.users,
        availability: null,
        id: `${action.payload.response.users.id}`,
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
      if (!action.payload.profile) { return state }
      assetState = {
        ...action.payload.profile,
        availability: null,
        dataExport: null,
      }
      if (_.get(assetState, 'avatar.tmp')) {
        delete assetState.avatar
      }
      if (_.get(assetState, 'coverImage.tmp')) {
        delete assetState.coverImage
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
        email: _.get(action, 'payload.response.invitations.email'),
      }
    default:
      return state
  }
}

