window.embetter.activeServices = [
  window.embetter.services.youtube,
  window.embetter.services.vimeo,
  window.embetter.services.soundcloud,
  window.embetter.services.dailymotion,
  window.embetter.services.mixcloud,
  window.embetter.services.codepen,
  window.embetter.services.bandcamp,
  window.embetter.services.ustream,
]
window.embetter.reloadPlayers = (el = document.body) => {
  window.embetter.utils.disposeDetachedPlayers()
  window.embetter.utils.initMediaPlayers(el, window.embetter.activeServices)
}
window.embetter.stopPlayers = (el = document.body) => {
  window.embetter.utils.unembedPlayers(el)
  window.embetter.utils.disposeDetachedPlayers()
}
window.embetter.removePlayers = (el = document.body) => {
  window.embetter.stopPlayers(el)
  for (const ready of el.querySelectorAll('.embetter-ready')) {
    ready.classList.remove('embetter-ready')
  }
  for (const statix of el.querySelectorAll('.embetter-static')) {
    statix.classList.remove('embetter-static')
  }
}
window.embetter.reloadPlayers()

