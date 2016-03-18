import { get } from 'lodash'

class MemoryStore {
  static store = {};

  static setItem(key, value, callback) {
    this.store[key] = value
    callback(null)
  }

  static getItem(key, callback) {
    callback(null, get(this.store, key, null))
  }

  static getAllKeys(callback) {
    callback(null, Object.keys(this.store))
  }

  static removeItem(key, callback) {
    delete this.store[key]
    callback(null)
  }

  static clear(callback) {
    try {
      Object.keys(this.store).forEach(key => delete this.store[key])
      callback(null)
    } catch (error) {
      callback(error)
    }
  }
}

export default MemoryStore
