import { debounce } from 'lodash'

const resizeObjects = []
let ticking = false
let hasListeners = false
let _probe = undefined

function callMethod(method, resizeProperties) {
  for (const obj of resizeObjects) {
    if (obj[method]) {
      obj[method](resizeProperties)
    }
  }
}

function getProbeElement() {
  if (typeof _probe !== 'undefined') { return _probe }
  _probe = document.getElementById('root')
  return _probe
}


// This is very rudimentary. needs things like 1x, 2x calculating the set
// Used for background images in Cover and Promotions
function getCoverImageSize(innerWidth) {
  if (innerWidth < 750) {
    return 'hdpi'
  } else if (innerWidth >= 750 && innerWidth < 1920) {
    return 'xhdpi'
  }
  return 'optimized'
}

// This could be anything really, baby, momma, poppa bear would work too.
function getViewportDeviceSize(gridColumnCount, innerWidth) {
  if (gridColumnCount >= 4) {
    return 'desktop'
  } else if (gridColumnCount >= 2 && innerWidth >= 640) {
    return 'tablet'
  }
  return 'mobile'
}

function getProbeProperties() {
  const probeElement = getProbeElement()
  const styles = window.getComputedStyle(probeElement, ':after')
  // this is in here because for some reason the
  // htc one returns 'auto' for the z-index
  let zIndex = styles.getPropertyValue('z-index')
  if (isNaN(zIndex)) { zIndex = 2 }
  const gridColumnCount = parseInt(zIndex, 10)
  return { gridColumnCount }
}


function setResizeProperties() {
  const wiw = window.innerWidth
  const probe = getProbeProperties()
  const gridColumnCount = parseInt(probe.gridColumnCount, 10)
  const viewportDeviceSize = getViewportDeviceSize(gridColumnCount, wiw)
  // Todo: Externalize padding out to the probe so I don't have to do things like
  // I'm about to do next :point_down:
  /* eslint-disable no-nested-ternary */
  const padding = viewportDeviceSize === 'mobile' ? 10 : (gridColumnCount >= 4 ? 40 : 20)
  /* eslint-enable no-nested-ternary */
  const columnWidth = Math.round((wiw - ((gridColumnCount + 1) * padding)) / gridColumnCount)
  const contentWidth = Math.round(wiw - (padding * 2))
  return {
    columnWidth,
    contentWidth,
    coverImageSize: getCoverImageSize(wiw),
    coverOffset: Math.round((wiw * 0.5625)),
    gridColumnCount,
    innerHeight: window.innerHeight,
    innerWidth: wiw,
    viewportDeviceSize,
  }
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

const resizeFunc = debounce(windowWasResized, 100)

export function addResizeObject(obj) {
  if (resizeObjects.indexOf(obj) === -1) {
    resizeObjects.push(obj)
    windowWasResized()
  }
  if (resizeObjects.length === 1 && !hasListeners) {
    hasListeners = true
    window.addEventListener('resize', resizeFunc)
  }
}

export function removeResizeObject(obj) {
  const index = resizeObjects.indexOf(obj)
  if (index > -1) {
    resizeObjects.splice(index, 1)
  }
  if (resizeObjects.length === 0) {
    hasListeners = false
    window.removeEventListener('resize', resizeFunc)
  }
}

if (typeof window !== 'undefined') {
  resized()
}
