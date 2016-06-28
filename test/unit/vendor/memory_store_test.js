import { expect, sinon } from '../../spec_helper'
import MemoryStore from '../../../src/vendor/memory_store'

describe('MemoryStore', () => {
  beforeEach((done) => {
    // done() accepts an error as the first argument
    // It should never get one
    MemoryStore.setItem('test', 1, done)
  })

  afterEach((done) => {
    MemoryStore.clear(done)
  })

  it('can store stuff', () => {
    const setCallback = sinon.spy()
    const getCallback = sinon.spy()

    MemoryStore.setItem('test', 2, setCallback)
    MemoryStore.getItem('test', getCallback)
    expect(setCallback).to.have.been.calledWith(null)
    expect(getCallback).to.have.been.calledWith(null, 2)
  })

  it('can store with promises', (done) => {
    MemoryStore.setItem('test', 2).then(() => {
      MemoryStore.getItem('test').then(val => {
        expect(val).to.eq(2)
        done()
      })
    })
  })

  it('can retrieve what you stored', () => {
    const fetchCallback = sinon.spy()

    MemoryStore.getItem('test', fetchCallback)
    expect(fetchCallback).to.have.been.calledWith(null, 1)
  })

  it('also knows promises', (done) => {
    MemoryStore.getItem('test').then((val) => {
      expect(val).to.eq(1)
      done()
    })
  })

  it('can remove an item', () => {
    const getCallback = sinon.spy()
    const removeCallback = sinon.spy()

    MemoryStore.removeItem('test', removeCallback)
    MemoryStore.getItem('test', getCallback)
    expect(removeCallback).to.have.been.calledWith(null)
    expect(getCallback).to.have.been.calledWith(null, null)
  })

  it('can get all keys stored currently', () => {
    const setCallback = sinon.spy()
    const getAllKeysCallback = sinon.spy()

    MemoryStore.setItem('test2', 2, setCallback)
    MemoryStore.setItem('test3', 3, setCallback)

    MemoryStore.getAllKeys(getAllKeysCallback)

    expect(setCallback).to.always.have.been.calledWith(null)
    expect(getAllKeysCallback).to.have.been.calledWith(null, ['test', 'test2', 'test3'])
  })

  it('can empty itself', () => {
    const noError = sinon.spy()
    const fetchCallback = sinon.spy()

    MemoryStore.getItem('test', fetchCallback)
    expect(fetchCallback.firstCall).to.have.been.calledWith(null, 1)

    MemoryStore.clear(noError)
    expect(noError).to.have.been.calledWith(null)

    MemoryStore.getItem('test', fetchCallback)
    expect(fetchCallback.secondCall).to.have.been.calledWith(null, null)
  })
})
