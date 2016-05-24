const REFRESH_PERIOD = 30 * 60 * 1000 // 30 minutes in microseconds
const focusEnabled = ENV.ENABLE_REFRESH_ON_FOCUS
const focusSupported = typeof document !== 'undefined' &&
                       typeof document.addEventListener !== 'undefined' &&
                       typeof document.visibilityState !== 'undefined'

let hiddenAt = null

function onHide() {
  hiddenAt = new Date()
}

function onShow() {
  const drift = new Date() - hiddenAt
  if (hiddenAt && (drift >= REFRESH_PERIOD)) {
    document.location.reload()
  }
}

function handleChange() {
  if (document.visibilityState === 'hidden') {
    onHide()
  } else if (document.visibilityState === 'visible') {
    onShow()
  }
}

export const startRefreshTimer = () => {
  if (focusEnabled && focusSupported) {
    document.addEventListener('visibilitychange', handleChange)
  }
}
