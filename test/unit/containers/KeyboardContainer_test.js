import { expect } from '../../spec_helper'
import { shouldContainerUpdate } from '../../../src/containers/KeyboardContainer'

describe('KeyboardContainer', () => {
  context('#shouldContainerUpdate', () => {
    const thisProps = {
      discoverKeyType: 'featured',
      isGridMode: true,
      isLoggedIn: true,
      isModalActive: false,
      pathname: '/discover',
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      discoverKeyType: 'trending',
      isGridMode: false,
      isLoggedIn: true,
      isModalActive: false,
      pathname: '/discover/trending',
      notPicked: 'notPicked',
    }
    const lastProps = {
      discoverKeyType: 'trending',
      isGridMode: false,
      isLoggedIn: true,
      isModalActive: false,
      pathname: '/discover/trending',
      notPicked: 'changed',
    }
    const shouldSameUpdate = shouldContainerUpdate(thisProps, sameProps)
    const shouldNextUpdate = shouldContainerUpdate(thisProps, nextProps)
    const shouldLastUpdate = shouldContainerUpdate(nextProps, lastProps)

    it('should not update state since the values are the same', () => {
      expect(shouldSameUpdate).to.be.false
    })

    it('should update state since all value have changed', () => {
      expect(shouldNextUpdate).to.be.true
    })

    it('should not update state since a non-picked value changed', () => {
      expect(shouldLastUpdate).to.be.false
    })
  })
})

