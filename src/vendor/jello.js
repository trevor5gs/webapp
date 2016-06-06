let memoizedIsAndroid = undefined
let memoizedIsChrome = undefined
let memoizedIsElloAndroid = undefined
let memoizedIsFirefox = undefined
let memoizedIsIOS = undefined
let memoizedIsSafari = undefined

export function isAndroid() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsAndroid !== 'undefined') { return memoizedIsAndroid }
  memoizedIsAndroid = /Android/gi.test(navigator.userAgent)
  return memoizedIsAndroid
}

export function isChrome() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsChrome !== 'undefined') { return memoizedIsChrome }
  memoizedIsChrome = !!window.chrome && !!window.chrome.webstore
  return memoizedIsChrome
}

export function isElloAndroid() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsElloAndroid !== 'undefined') { return memoizedIsElloAndroid }
  memoizedIsElloAndroid = /Ello Android/gi.test(navigator.userAgent)
  return memoizedIsElloAndroid
}

export function isFirefox() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsFirefox !== 'undefined') { return memoizedIsFirefox }
  memoizedIsFirefox = /Firefox/gi.test(navigator.userAgent)
  return memoizedIsFirefox
}

export function isSafari() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsSafari !== 'undefined') { return memoizedIsSafari }
  memoizedIsSafari = /Safari/gi.test(navigator.userAgent) && !isChrome()
  return memoizedIsSafari
}

export function isIOS() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsIOS !== 'undefined') { return memoizedIsIOS }
  memoizedIsIOS = /iPad|iPhone|iPod/gi.test(navigator.userAgent)
  return memoizedIsIOS
}

// -------------------------------------

export function addFeatureDetection() {
  const cl = document.documentElement.classList
  if (!('ontouchstart' in document.documentElement)) {
    cl.add('no-touch')
  }
  const onTouchStart = () => {
    document.removeEventListener('touchstart', onTouchStart)
    cl.remove('no-touch')
    cl.add('has-touch')
  }
  if (isChrome()) { cl.add('isChrome') }
  document.addEventListener('touchstart', onTouchStart)
}

export function hideSoftKeyboard() {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

