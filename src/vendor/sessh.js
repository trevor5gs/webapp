let sessh
if (typeof sessionStorage !== 'undefined') {
  sessh = sessionStorage
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
  }
  sessh = new Sessh()
}

export default sessh
