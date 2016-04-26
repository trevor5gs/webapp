/* eslint-disable no-param-reassign */

export default function scrollTop(_node) {
  const node = _node || window
  if (node && typeof node.scrollTop !== 'undefined') {
    return node.scrollTop
  }

  if (window.hasOwnProperty('scrollY')) {
    return window.scrollY
  }
  const offset = document.documentElement ?
    document.documentElement.scrollTop :
    0
  return document.body.scrollTop + offset
}

function scrollToFn(top) {
  return () => {
    window.scrollTo(0, top)
  }
}

export function scrollToTop(pos = 0) {
  let top = scrollTop()
  let up = 10
  let timeout = 10
  const max = 1000

  while (top > pos) {
    timeout += 10
    up = up * 1.1 < max ? up * 1.1 : max
    top -= up
    setTimeout(scrollToFn(top), timeout)
  }
}

export function scrollToOffsetTop() {
  window.scrollTo(0, Math.round(window.innerWidth * 0.5625) - 200)
}

function scrollElToFn(el, top) {
  return () => {
    el.scrollTop = top
  }
}

export function scrollElToTop(el) {
  let top = scrollTop(el)
  let up = 10
  let timeout = 10
  const max = 1000

  while (top > 0) {
    timeout += 10
    up = up * 1.1 < max ? up * 1.1 : max
    top -= up
    setTimeout(scrollElToFn(el, top), timeout)
  }
}

