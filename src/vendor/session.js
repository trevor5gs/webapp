let session
if (typeof sessionStorage !== 'undefined') {
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
      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          this.removeItem(key)
        }
      }
    }
  }
  session = new Sessh()
}

export default session
