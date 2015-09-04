import React from 'react/addons'
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment'
import jsdom from 'mocha-jsdom'

export { expect as expect } from 'chai'
export { React as React }

export const TestUtils = React.addons.TestUtils

export function jsdomReact() {
  jsdom()
  ExecutionEnvironment.canUseDOM = true
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

function isValidStreamMetaKey(key) {
  const validKeys = [
    'mappingType',
    'renderStream',
  ]
  return validKeys.indexOf(key) > -1
}

export function getRenderedComponent(component, options = {}, children = null) {
  const shallowRenderer = TestUtils.createRenderer()
  shallowRenderer.render(React.createElement(component, options, children))
  return shallowRenderer.getRenderOutput()
}

export function renderIntoDocument(component, options = {}, children = null) {
  return TestUtils.renderIntoDocument(React.createElement(component, options, children))
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

