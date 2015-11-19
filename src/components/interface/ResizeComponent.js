import debounce from 'lodash.debounce'

const resizeObjects = []
let ticking = false
const probeElement = document.getElementById('root')

function callMethod(method, resizeProperties) {
  for (const obj of resizeObjects) {
    if (obj[method]) {
      obj[method](resizeProperties)
    }
  }
}

// function getOptimalImageSize(windowWidth = window.innerWidth) {
//   return reduce([1920, 1500, 750, 375, 180], (prev, curr) => {
//     return curr > windowWidth ? curr : prev
//   })
// }

function getProbeProperties() {
  const styles = window.getComputedStyle(probeElement, ':after')
  const viewportSetting = styles.getPropertyValue('content')
  const gridColumnCount = parseInt(styles.getPropertyValue('z-index'), 10)
  return { viewportSetting, gridColumnCount }
}

// TODO: Add which image (hdpi, xhdpi, mhdpi, etc)
function getResizeProperties() {
  const wiw = window.innerWidth
  const probe = getProbeProperties()
  return {
    windowWidth: wiw,
    windowHeight: window.innerHeight,
    coverOffset: Math.round((wiw * 0.5625)),
    viewportSetting: probe.viewportSetting,
    gridColumnCount: probe.gridColumnCount,
  }
}

function resized() {
  const resizeProperties = getResizeProperties()
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
  }
  if (resizeObjects.length === 1) {
    window.addEventListener('resize', debounce(windowWasResized, 100))
    windowWasResized()
  }
}

export function removeResizeObject(obj) {
  const index = resizeObjects.indexOf(obj)
  if (index > -1) {
    resizeObjects.splice(index, 1)
  }
  if (resizeObjects.length === 0) {
    window.removeEventListener('resize')
  }
}

