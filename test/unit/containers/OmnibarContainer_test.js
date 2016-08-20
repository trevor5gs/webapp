import { stubAvatar } from '../../support/stubs'
import { shouldContainerUpdate } from '../../../src/containers/OmnibarContainer'

describe('OmnibarContainer', () => {
  context('#shouldContainerUpdate', () => {
    const avatar = stubAvatar()
    const thisProps = {
      avatar,
      classList: 'isFresh',
      isActive: true,
      isFullScreen: true,
      isLoggedIn: true,
      notPicked: 'notPicked',
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      avatar,
      classList: 'isNotFresh',
      isActive: false,
      isFullScreen: false,
      isLoggedIn: true,
      notPicked: 'notPicked',
    }
    const lastProps = { ...nextProps, notPicked: 'changed' }

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

