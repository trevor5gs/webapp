const dragObjects = []
let hasListeners = false
let dragging = false

function callMethod(method, props) {
  for (const obj of dragObjects) {
    if (obj[method]) {
      obj[method](props)
    }
  }
}

function mouseMove(e) {
  if (!dragging) return
  callMethod('onDragMove', e)
}

function mouseDown(e) {
  // return if not the drag handler
  if (e.target.className.indexOf('DragHandler') === -1) return
  dragging = true
  callMethod('onDragStart', e)
  document.addEventListener('mousemove', mouseMove)
}

function mouseUp(e) {
  if (!dragging) return
  document.removeEventListener('mousemove', mouseMove)
  callMethod('onDragEnd', e)
}

function addListeners() {
  document.addEventListener('mousedown', mouseDown)
  document.addEventListener('mouseup', mouseUp)
}

function removeListeners() {
  document.removeEventListener('mousedown', mouseDown)
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
}

export function addDragObject(obj) {
  if (dragObjects.indexOf(obj) === -1) {
    dragObjects.push(obj)
  }
  if (dragObjects.length === 1 && !hasListeners) {
    hasListeners = true
    addListeners()
  }
}

export function removeDragListeners(obj) {
  const index = dragObjects.indexOf(obj)
  if (index > -1) {
    dragObjects.splice(index, 1)
  }
  if (dragObjects.length === 0) {
    hasListeners = false
    removeListeners()
  }
}

