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

