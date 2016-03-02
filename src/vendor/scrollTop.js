export default function scrollTop() {
  if (window.hasOwnProperty('scrollY')) {
    return window.scrollY
  }
  const offset = document.documentElement ?
    document.documentElement.scrollTop :
    0
  return document.body.scrollTop + offset
}
