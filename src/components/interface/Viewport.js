export const isAndroid = () => {
  if (typeof window === 'undefined') { return false }
  return !(navigator.userAgent.match(/Android/i) === null)
}

export const hideSoftKeyboard = () => {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

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

export const scrollToTop = ({ isOffsetLayout = false, left = 0, top = 0 }) => {
  if (typeof window === 'undefined') { return }
  if (isOffsetLayout && !top) {
    window.scrollTo(0, Math.round((window.innerWidth * 0.5625)) - 200)
    return
  }
  window.scrollTo(left, top)
}

