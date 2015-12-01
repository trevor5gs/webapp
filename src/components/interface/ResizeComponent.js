import debounce from 'lodash.debounce'
import { GUI } from '../../constants/gui_types'

const resizeObjects = []
let ticking = false
let hasListeners = false

function callMethod(method, resizeProperties) {
  for (const obj of resizeObjects) {
    if (obj[method]) {
      obj[method](resizeProperties)
    }
  }
}

// This is very rudimentary. needs things like 1x, 2x calculating the set
// Used for background images in Cover and Banderoles
function getCoverImageSize(innerWidth) {
  if (innerWidth < 1500) {
    return 'hdpi'
  } else if (innerWidth >= 1500 && innerWidth < 1920) {
    return 'xhdpi'
  }
  return 'optimized'
}

function getProbeProperties() {
  const probeElement = document.getElementById('root')
  const styles = window.getComputedStyle(probeElement, ':after')
  const viewportSetting = styles.getPropertyValue('content')
  const gridColumnCount = parseInt(styles.getPropertyValue('z-index'), 10)
  return { viewportSetting, gridColumnCount }
}

function setResizeProperties() {
  const wiw = window.innerWidth
  const probe = getProbeProperties()
  const gridColumnCount = parseInt(probe.gridColumnCount, 10)
  const padding = gridColumnCount >= 4 ? 40 : 20
  const columnWidth = Math.round((wiw - ((gridColumnCount + 1) * padding)) / gridColumnCount)
  const contentWidth = Math.round(wiw - (padding * 2))

  GUI.innerWidth = wiw
  GUI.innerHeight = window.innerHeight
  GUI.coverOffset = Math.round((wiw * 0.5625))
  GUI.coverImageSize = getCoverImageSize(wiw)
  GUI.viewportSetting = probe.viewportSetting
  GUI.gridColumnCount = gridColumnCount
  GUI.columnWidth = columnWidth
  GUI.contentWidth = contentWidth
  return GUI
}

function resized() {
  const resizeProperties = setResizeProperties()
  callMethod('onResize', resizeProperties)
}

function windowWasResized() {
  if (!ticking) {
    requestAnimationFrame(() => {
      resized()
      ticking = false
    })
    ticking = true
  }
}

export function addResizeObject(obj) {
  if (resizeObjects.indexOf(obj) === -1) {
    resizeObjects.push(obj)
    windowWasResized()
  }
  if (resizeObjects.length === 1 && !hasListeners) {
    hasListeners = true
    window.addEventListener('resize', debounce(windowWasResized, 100))
  }
}

export function removeResizeObject(obj) {
  const index = resizeObjects.indexOf(obj)
  if (index > -1) {
    resizeObjects.splice(index, 1)
  }
  if (resizeObjects.length === 0) {
    hasListeners = false
    window.removeEventListener('resize')
  }
}

