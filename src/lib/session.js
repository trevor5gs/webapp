/* eslint-disable import/no-mutable-exports */

function isSessionStorageSupported() {
  if (typeof window === 'undefined') { return false }
  const testKey = 'test-sessionStorage'
  const storage = window.sessionStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

let session
if (isSessionStorageSupported()) {
  session = sessionStorage
} else {
  const storage = {}
  class Sessh {
    setItem(key, value) {
      storage[key] = value.toString()
    }
    getItem(key) {
      return storage[key]
    }
    removeItem(key) {
      delete storage[key]
    }
    clear() {
      Object.keys(storage).forEach((key) => {
        this.removeItem(key)
      })
    }
  }
  session = new Sessh()
}

export default session
