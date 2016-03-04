export default function scrollTop(node) {
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
