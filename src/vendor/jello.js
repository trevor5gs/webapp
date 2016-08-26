let memoizedIsAndroid
let memoizedIsChrome
let memoizedIsElloAndroid
let memoizedIsFirefox
let memoizedIsIE11
let memoizedIsIOS
let memoizedIsSafari

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

export function isIE11() {
  if (typeof window === 'undefined') { return false }
  if (typeof memoizedIsIE11 !== 'undefined') { return memoizedIsIE11 }
  const docStyle = document.documentElement.style
  memoizedIsIE11 = '-ms-scroll-limit' in docStyle && '-ms-ime-align' in docStyle
  return memoizedIsIE11
}

export function getElloPlatform() {
  return isElloAndroid() ? 'ello-android-app' : 'ello-webapp'
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
  if (isFirefox()) { cl.add('isFirefox') }
  if (isIE11()) { cl.add('isIE11') }
  document.addEventListener('touchstart', onTouchStart)
}

export function hideSoftKeyboard() {
  if (document.activeElement) {
    document.activeElement.blur()
  }
}

