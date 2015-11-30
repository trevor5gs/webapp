import React from 'react/addons'
import jsdom from 'mocha-jsdom'

export { expect as expect } from 'chai'
export { React as React }
export sinon from 'sinon'
export { clearJSON, json, stub } from './stubs'

export const TestUtils = React.addons.TestUtils

// create a js document
export function jsdomReact() {
  jsdom()
}

// React helpers
export function getRenderedComponent(component, options = {}, children = null) {
  const shallowRenderer = TestUtils.createRenderer()
  shallowRenderer.render(React.createElement(component, options, children))
  return shallowRenderer.getRenderOutput()
}

export function renderIntoDocument(component, options = {}, children = null) {
  return TestUtils.renderIntoDocument(React.createElement(component, options, children))
}

// object key helpers
function isValidStreamMetaKey(key) {
  const validKeys = [
    'defaultMode',
    'mappingType',
    'renderStream',
    'resultFilter',
    'resultKey',
  ]
  return validKeys.indexOf(key) > -1
}

export function hasStreamMetadata(action) {
  return (
    typeof action.meta !== 'undefined' &&
    Object.keys(action.meta).every(isValidStreamMetaKey)
  )
}

function isValidFSAKey(key) {
  const validKeys = [
    'type',
    'payload',
    'error',
    'meta',
  ]
  return validKeys.indexOf(key) > -1
}

export function isFSA(action) {
  return (
    typeof action.type !== 'undefined' &&
    Object.keys(action).every(isValidFSAKey)
  )
}

function isValidResultKey(key) {
  const validKeys = [
    'type',
    'ids',
    'pagination',
  ]
  return validKeys.indexOf(key) > -1
}

export function isValidResult(result) {
  return (
    typeof result.type !== 'undefined' &&
    Object.keys(result).every(isValidResultKey)
  )
}

