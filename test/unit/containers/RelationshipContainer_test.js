import { RELATIONSHIP_PRIORITY as PRIORITY } from '../../../src/constants/relationship_types'
import { getNextBlockMutePriority } from '../../../src/containers/RelationshipContainer'

describe('RelationshipContainer', () => {
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
})

