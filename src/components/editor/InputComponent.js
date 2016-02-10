import { addKeyObject, removeKeyObject } from '../interface/KeyComponent'
import { getWordFromSelection } from './SelectionUtil'
import { emojiRegex, userRegex } from '../completers/Completer'

const methods = {}

export let range = null
const rangeObjects = []
let hasListeners = false

function getPositionFromSelection() {
  range = window.getSelection().getRangeAt(0)
  const pos = range.getBoundingClientRect()
  // TODO: magic number of -60 should be tested
  // in multiple browsers, this works for safari
  return { left: Math.round(pos.left - 60), top: Math.round(pos.top) }
}

function getActiveTextTools() {
  if (!range) return {}
  const contents = range.cloneContents()
  const parentNode = range.commonAncestorContainer.parentNode
  const tagName = parentNode.nodeName.toLowerCase()
  return {
    isLinkActive: tagName === 'a' || contents.querySelectorAll('a').length > 0,
    isBoldActive: document.queryCommandEnabled('bold') && document.queryCommandState('bold'),
    isItalicActive: document.queryCommandEnabled('italic') && document.queryCommandState('italic'),
  }
}

function callMethod(method, vo) {
  for (const obj of rangeObjects) {
    if (obj[method]) {
      obj[method](vo)
    }
  }
}

function onClick(e) {
  callMethod('onHideCompleter')
  if (!e.target.classList.contains('TextToolButton')) {
    callMethod('onHideTextTools', { activeTools: null })
  }
}

function onKeyUp(e) {
  // Handles text tools show/hide and position
  if (!e.target.classList || !e.target.classList.contains('text')) return false
  const word = getWordFromSelection()
  if (word && word.length) {
    callMethod('onPositionChange', { coordinates: getPositionFromSelection() })
    callMethod('onShowTextTools', { activeTools: getActiveTextTools() })
  } else {
    callMethod('onHideTextTools', { activeTools: null })
  }
  // Handles autocompletion stuff
  // check for autocompletable strings: currently usernames and emoji codes
  switch (e.which) {
    case 9: // tab
    case 13: // enter
    case 27: // esc
    case 38: // up
    case 40: // down
      return false
    default:
      break
  }
  // now do something for the auto completers
  if (word.match(userRegex)) {
    callMethod('onUserCompleter', { word })
  } else if (word.match(emojiRegex)) {
    callMethod('onEmojiCompleter', { word })
  } else {
    callMethod('onHideCompleter')
  }
}
methods.onKeyUp = (e) =>
  onKeyUp(e)

function onKeyDown(e) {
  if (!e.target.classList || !e.target.classList.contains('text')) return false
  // b or i for key commands
  if ((e.keyCode === 66 || e.keyCode === 73) && (e.metaKey || e.ctrlKey)) {
    callMethod('onShowTextTools', { activeTools: getActiveTextTools() })
  }
  if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
    callMethod('onSubmitPost')
  }
}
methods.onKeyDown = (e) =>
  onKeyDown(e)

function addListeners() {
  document.addEventListener('click', onClick)
  addKeyObject(methods)
}

function removeListeners() {
  document.removeEventListener('click', onClick)
  removeKeyObject(methods)
}

export function addInputObject(obj) {
  if (rangeObjects.indexOf(obj) === -1) {
    rangeObjects.push(obj)
  }
  if (rangeObjects.length === 1 && !hasListeners) {
    hasListeners = true
    addListeners()
  }
}

export function removeInputObject(obj) {
  const index = rangeObjects.indexOf(obj)
  if (index > -1) {
    rangeObjects.splice(index, 1)
  }
  if (rangeObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

