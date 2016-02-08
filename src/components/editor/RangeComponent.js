const rangeObjects = []
let hasListeners = false
export let range = null

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
  const props = {
    ...vo,
    activeTools: getActiveTextTools(),
    coordinates: getPositionFromSelection(),
  }

  for (const obj of rangeObjects) {
    if (obj[method]) {
      obj[method](props)
    }
  }
}

function onKeyUp(e) {
  if (!e.target.classList || !e.target.classList.contains('text')) return
  const str = window.getSelection().toString()
  if (str.trim().length === 0) {
    callMethod('onRangeChanged', { hideTextTools: true })
  } else {
    callMethod('onRangeChanged', { hideTextTools: false })
  }
}

function onKeyDown(e) {
  const key = e.keyCode
  // b or i for key commands
  if ((key === 66 || key === 73) && (e.metaKey || e.ctrlKey)) {
    requestAnimationFrame(() => {
      callMethod('onRangeChanged')
    })
  }
}


function addListeners() {
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('keydown', onKeyDown)
}

function removeListeners() {
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('keydown', onKeyDown)
}

export function addRangeObject(obj) {
  if (rangeObjects.indexOf(obj) === -1) {
    rangeObjects.push(obj)
  }
  if (rangeObjects.length === 1 && !hasListeners) {
    hasListeners = true
    addListeners()
  }
}

export function removeRangeObject(obj) {
  const index = rangeObjects.indexOf(obj)
  if (index > -1) {
    rangeObjects.splice(index, 1)
  }
  if (rangeObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

