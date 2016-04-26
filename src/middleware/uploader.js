import 'isomorphic-fetch'
import React from 'react'
import { bindActionCreators } from 'redux'
import { camelizeKeys } from 'humps'
import * as ACTION_TYPES from '../constants/action_types'
import Dialog from '../components/dialogs/Dialog'
import { s3CredentialsPath } from '../networking/api'
import { closeAlert, openAlert } from '../actions/modals'
import { isValidFileType, SUPPORTED_IMAGE_TYPES } from '../helpers/file_helper'

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

  function popAlertsForFile({ fileType, isValid }) {
    return new Promise((resolve, reject) => {
      if (isValid) {
        if (fileType === SUPPORTED_IMAGE_TYPES.GIF &&
            (type === ACTION_TYPES.PROFILE.SAVE_AVATAR ||
             type === ACTION_TYPES.PROFILE.SAVE_COVER)) {
          // .gif and cover/avatar upload
          store.dispatch(openAlert(
            <Dialog
              title="Looks like you uploaded a .gif."
              body="If it’s animated people will only see the animation on your profile page."
              onClick={ bindActionCreators(closeAlert, store.dispatch) }
            />
          ))
        }
        return resolve()
      }
      store.dispatch(openAlert(
        <Dialog
          title="Invalid file type"
          body="We support .jpg, .gif, .png, .tif and .bmp files."
          onClick={ bindActionCreators(closeAlert, store.dispatch) }
        />
      ))
      return reject()
    })
  }

  if (!endpoint) {
    return (
      isValidFileType(file)
      .then(popAlertsForFile)
      .then(fetchCredentials)
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

  return (
    isValidFileType(file)
    .then(popAlertsForFile)
    .then(fetchCredentials)
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
}
