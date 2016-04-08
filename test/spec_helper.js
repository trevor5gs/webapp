// set global ENV for testing since
// webpack doesn't inject it here
require('dotenv').load()
global.ENV = JSON.stringify(require('../env'))

import React from 'react'
import jsdom from 'mocha-jsdom'
import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
export { sinon }
export { expect }
export { React as React }
export { clearJSON, json, stub } from './stubs'

import TestUtils from 'react-addons-test-utils'
export { TestUtils }

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
    'mappingType',
    'renderStream',
    'resultFilter',
    'resultKey',
    'updateKey',
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

