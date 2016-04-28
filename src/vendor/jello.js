let _isAndroid = undefined
let _isFirefox = undefined

export const addFeatureDetection = () => {
  const cl = document.documentElement.classList
  if (!('ontouchstart' in document.documentElement)) {
    cl.add('no-touch')
  }
  const onTouchStart = () => {
    document.removeEventListener('touchstart', onTouchStart)
    cl.remove('no-touch')
    cl.add('has-touch')
  }
  document.addEventListener('touchstart', onTouchStart)
}

export const hideSoftKeyboard = () => {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

export const isAndroid = () => {
  if (typeof window === 'undefined') { return false }
  if (typeof _isAndroid !== 'undefined') { return _isAndroid }
  _isAndroid = /Android/gi.test(navigator.userAgent)
  return _isAndroid
}

export const isFirefox = () => {
  if (typeof window === 'undefined') { return false }
  if (typeof _isFirefox !== 'undefined') { return _isFirefox }
  _isFirefox = /Firefox/gi.test(navigator.userAgent)
  return _isFirefox
}

