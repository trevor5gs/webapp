export { test } from 'tape'
import React from 'react/addons'

const shallowRenderer = React.addons.TestUtils.createRenderer()

function isValidFSAKey(key) {
  const validKeys = [
    'type',
    'payload',
    'error',
    'meta',
  ]
  return validKeys.indexOf(key) > -1
}

function isValidStreamMetaKey(key) {
  const validKeys = [
    'mappingType',
    'renderStream',
  ]
  return validKeys.indexOf(key) > -1
}

export function getRenderedComponent(component, options = {}, children = null) {
  shallowRenderer.render(React.createElement(component, options, children))
  return shallowRenderer.getRenderOutput()
}

export function hasStreamMetadata(action) {
  return (
    typeof action.meta !== 'undefined' &&
    Object.keys(action.meta).every(isValidStreamMetaKey)
  )
}

export function isFSA(action) {
  return (
    typeof action.type !== 'undefined' &&
    Object.keys(action).every(isValidFSAKey)
  )
}

