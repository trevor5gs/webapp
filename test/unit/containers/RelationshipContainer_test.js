import { noop } from 'lodash'
import { stubJSONStore, stubUser } from '../../stubs'
import { RELATIONSHIP_PRIORITY as PRIORITY } from '../../../src/constants/relationship_types'
import {
  getNextBlockMutePriority, mapStateToProps, shouldContainerUpdate,
} from '../../../src/containers/RelationshipContainer'

describe('RelationshipButton', () => {
  context('#getNextBlockMutePriority', () => {
    it('returns a INACTIVE priority if it is BLOCK', () => {
      expect(getNextBlockMutePriority(PRIORITY.BLOCK)).to.equal(PRIORITY.INACTIVE)
    })

    it('returns a INACTIVE priority if it is MUTE', () => {
      expect(getNextBlockMutePriority(PRIORITY.MUTE)).to.equal(PRIORITY.INACTIVE)
    })

    it('returns a BLOCK priority if it is FRIEND and it is requested to be block', () => {
      expect(getNextBlockMutePriority(PRIORITY.FRIEND, 'block')).to.equal(PRIORITY.BLOCK)
    })

    it('returns a MUTE priority if it is NOISE and it is requested to be mute', () => {
      expect(getNextBlockMutePriority(PRIORITY.NOISE, 'mute')).to.equal(PRIORITY.MUTE)
    })

    it('returns a INACTIVE priority if it is NOISE and it hits the inner default', () => {
      expect(getNextBlockMutePriority(PRIORITY.NOISE)).to.equal(PRIORITY.INACTIVE)
    })
  })

  context('#shouldContainerUpdate', () => {
    const user = stubUser()
    const thisProps = {
      className: '',
      deviceSize: 'mobile',
      hasBlockMuteButton: false,
      isLoggedIn: true,
      onClickCallback: noop,
      pathname: '/discover',
      previousPath: '/following',
      relationshipPriority: PRIORITY.FRIEND,
      shouldRenderBlockMute: false,
      user,
      userId: user.id,
      username: user.username,
    }
    const sameProps = { ...thisProps }
    const nextProps = {
      className: 'isInHeader',
      deviceSize: 'desktop',
      hasBlockMuteButton: true,
      isLoggedIn: true,
      onClickCallback: noop,
      pathname: '/onboarding',
      previousPath: '/discover',
      relationshipPriority: PRIORITY.FRIEND,
      shouldRenderBlockMute: false,
      user,
      userId: user.id,
      username: user.username,
    }
    const lastProps = { ...nextProps, user: stubUser({ id: '666' }) }

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

  context('#mapStateToProps', () => {
    const json = stubJSONStore()
    const user = stubUser({ id: '1', username: 'archer' })
    const props = {
      user,
      hasBlockMuteButton: true,
    }
    const state = {
      authentication: { isLoggedIn: true },
      gui: { deviceSize: 'mobile' },
      json,
      routing: { location: { pathname: '/discover' }, previousPath: '/onboarding' },
    }

    const expected = {
      deviceSize: 'mobile',
      isLoggedIn: true,
      onClickCallback: 'onRelationshipUpdate',
      pathname: '/discover',
      previousPath: '/onboarding',
      relationshipPriority: null,
      shouldRenderBlockMute: true,
      userId: '1',
      username: 'archer',
    }

    const mapped = mapStateToProps(state, props)

    it('should deep equal the expected properties', () => {
      expect(mapped).to.deep.equal(expected)
    })
  })
})

