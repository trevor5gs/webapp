import { addKeyObject, removeKeyObject } from '../interface/KeyComponent'
import { getWordFromSelection } from './SelectionUtil'
import { emojiRegex, userRegex } from '../completers/Completer'

const methods = {}

export let range = null
const inputObjects = []
let hasListeners = false

function getPositionFromSelection() {
  range = window.getSelection().getRangeAt(0)
  const pos = range.getBoundingClientRect()
  // TODO: magic number of -60 should be tested
  // in multiple browsers, this works for safari
  return { left: Math.round(pos.left), top: Math.round(pos.top) }
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
  for (const obj of inputObjects) {
    if (obj[method]) {
      obj[method](vo)
    }
  }
}

function toggleTools(input) {
  const word = input.trim()
  if (word && word.length) {
    callMethod('onPositionChange', { coordinates: getPositionFromSelection() })
    callMethod('onShowTextTools', { activeTools: getActiveTextTools() })
  } else {
    callMethod('onHideTextTools', { activeTools: null })
  }
}

function onKeyUp(e) {
  // Handles text tools show/hide and position
  if (!e.target.classList || !e.target.classList.contains('text')) { return }
  toggleTools(window.getSelection().toString())
  // Handles autocompletion stuff
  // check for autocompletable strings: currently usernames and emoji codes
  switch (e.which) {
    case 9: // tab
    case 13: // enter
    case 27: // esc
    case 38: // up
    case 40: // down
      return
    default:
      break
  }
  const word = getWordFromSelection()
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
  if (!e.target.classList || !e.target.classList.contains('text')) { return }
  // b or i for key commands
  if ((e.keyCode === 66 || e.keyCode === 73) && (e.metaKey || e.ctrlKey)) {
    requestAnimationFrame(() => {
      callMethod('onShowTextTools', { activeTools: getActiveTextTools() })
    })
  }
  if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
    callMethod('onSubmitPost')
  }
  // adding br tags while completing causes all of the text to disappear
  const completerActive = document.body.querySelector('.Completion.active')
  if (e.keyCode === 13 && !/firefox/gi.test(window.navigator.userAgent) && !completerActive) {
    e.preventDefault() // Prevent DIVs from being created
    document.execCommand('insertHTML', false, '<br/><br/>')
  }
}
methods.onKeyDown = (e) =>
  onKeyDown(e)

function onClick(e) {
  callMethod('onHideCompleter')
  const classList = e.target.classList
  if (classList.contains('text')) {
    requestAnimationFrame(() => {
      onKeyUp(e)
    })
  } else if (!classList.contains('TextToolButton') &&
      !classList.contains('TextToolForm') &&
      !classList.contains('TextToolLinkInput')) {
    callMethod('onHideTextTools', { activeTools: null })
  }
}

function addListeners() {
  document.addEventListener('click', onClick)
  addKeyObject(methods)
}

function removeListeners() {
  document.removeEventListener('click', onClick)
  removeKeyObject(methods)
}

export function addInputObject(obj) {
  if (inputObjects.indexOf(obj) === -1) {
    inputObjects.push(obj)
  }
  if (inputObjects.length === 1 && !hasListeners) {
    hasListeners = true
    addListeners()
  }
}

export function removeInputObject(obj) {
  const index = inputObjects.indexOf(obj)
  if (index > -1) {
    inputObjects.splice(index, 1)
  }
  if (inputObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

