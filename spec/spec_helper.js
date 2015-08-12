import { expect as exp } from 'chai'

export let expect = exp

export function isFSA(action) {
  return (
    typeof action.type !== 'undefined' &&
    Object.keys(action).every(isValidKey)
  )
}

function isValidKey(key) {
  const validKeys = [
    'type',
    'payload',
    'error',
    'meta'
  ]
  return validKeys.indexOf(key) > -1
}
