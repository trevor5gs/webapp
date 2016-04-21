import 'isomorphic-fetch'
import React from 'react'
import { bindActionCreators } from 'redux'
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'
import Dialog from '../components/dialogs/Dialog'
import { s3CredentialsPath } from '../networking/api'
import { openAlert, closeAlert } from '../actions/modals'

function checkStatus(response) {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

function parseJSON(response) {
  return (response.status === 200) ? response.json() : response
}

function imageGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = (c === 'x' ? r : r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function getFilename(type) {
  return `ello-${imageGuid() + type.replace('image/', '.')}`
}

function getFileKey(prefix, filename) {
  return `${prefix}/${encodeURIComponent(filename)}`
}

function getAssetUrl(endpoint, key) {
  return `${endpoint}/${key}`
}

function getUploadData(key, credentials, file) {
  const data = new FormData()
  data.append('key', key)
  data.append('AWSAccessKeyId', credentials.access_key)
  data.append('acl', 'public-read')
  data.append('success_action_status', '201')
  data.append('policy', credentials.policy)
  data.append('signature', credentials.signature)
  data.append('Content-Type', file.type)
  data.append('file', file)
  return data
}

function getCredentialsHeader(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}

export const uploader = store => next => action => {
  const { payload, type, meta } = action

  // This is problematic... :(
  if ((type !== ACTION_TYPES.PROFILE.SAVE_AVATAR &&
        type !== ACTION_TYPES.PROFILE.SAVE_COVER &&
        type !== ACTION_TYPES.POST.SAVE_IMAGE
      ) || !payload) {
    return next(action)
  }

  const { endpoint, file } = payload

  let assetUrl
  const REQUEST = `${type}_REQUEST`
  const SUCCESS = `${type}_SUCCESS`
  const FAILURE = `${type}_FAILURE`
  const state = store.getState()
  const { accessToken } = state.authentication

  function fetchCredentials() {
    // dispatch the start of the request
    next({ type: REQUEST, payload, meta })
    return fetch(s3CredentialsPath().path, {
      method: 'GET',
      headers: getCredentialsHeader(accessToken),
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  function postAsset(response) {
    const { credentials } = response
    const filename = getFilename(file.type)
    const key = getFileKey(credentials.prefix, filename)
    assetUrl = getAssetUrl(credentials.endpoint, key)

    return fetch(credentials.endpoint, {
      method: 'POST',
      body: getUploadData(key, credentials, file),
    })
      .then(checkStatus)
  }

  function saveLocationToApi() {
    const vo = (type === ACTION_TYPES.PROFILE.SAVE_AVATAR) ?
      { remote_avatar_url: assetUrl } :
      { remote_cover_image_url: assetUrl }
    return fetch(endpoint.path, {
      method: 'PATCH',
      headers: getCredentialsHeader(accessToken),
      body: JSON.stringify(vo),
    })
      .then(checkStatus)
      .then(parseJSON)
  }

  // determine if the file should be uploaded
  const fr = new FileReader()
  let shouldSendToServer = false
  let isGif = false
  fr.onloadend = (e) => {
    const arr = (new Uint8Array(e.target.result)).subarray(0, 4)
    let header = ''
    for (const value of arr) {
      header += value.toString(16)
    }
    if (/ffd8ff/.test(header)) {
      shouldSendToServer = true // image/jpeg
    } else if (/424D/.test(header)) {
      shouldSendToServer = true // image/bmp
    } else {
      switch (header) {
        case '47494638': // image/gif
          isGif = false
          shouldSendToServer = true
          break
        case '89504e47': // image/png
        case '49492a00': // image/tiff - little endian
        case '4d4d002a': // image/tiff - big endian
          shouldSendToServer = true
          break
        default:
          shouldSendToServer = false
          break
      }
    }
    if (shouldSendToServer) {
      if (isGif &&
          (type === ACTION_TYPES.PROFILE.SAVE_AVATAR || type === ACTION_TYPES.PROFILE.SAVE_COVER)) {
        store.dispatch(openAlert(
          <Dialog
            title="Looks like you uploaded a .gif"
            body="If it’s animated people will only see the animation on your profile page."
            onClick={ bindActionCreators(closeAlert, store.dispatch) }
          />
        ))
      }
      // actually send it to server
      if (!endpoint) {
        return (
          fetchCredentials()
          .then(postAsset)
          .then(() => {
            payload.response = { url: assetUrl }
            next({ meta, payload, type: SUCCESS })
            return true
          })
          .catch(error => {
            next({ error, meta, payload, type: FAILURE })
            return false
          })
        )
      }

      return (
        fetchCredentials()
        .then(postAsset)
        .then(saveLocationToApi)
        .then(response => {
          payload.response = { ...camelizeKeys(response), assetUrl }
          next({ meta, payload, type: SUCCESS })
          return true
        })
        .catch(error => {
          next({ error, meta, payload, type: FAILURE })
          return false
        })
      )
    // Test to make sure we have a file and file.type (real failure) Safari
    // sometimes reports the length of the array as well.. wtf?
    } else if (file && file.type) {
      return store.dispatch(openAlert(
        <Dialog
          title="Invalid file type"
          body="We support .jpg, .gif, .png, or .bmp files for avatar and cover images."
          onClick={ bindActionCreators(closeAlert, store.dispatch) }
        />
      ))
    }
    return false
  }
  fr.readAsArrayBuffer(file)
  return true
}

