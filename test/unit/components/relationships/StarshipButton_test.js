import { expect } from '../../../spec_helper'
import { RELATIONSHIP_PRIORITY } from '../../../../src/constants/relationship_types'
import { getNextPriority } from '../../../../src/components/relationships/StarshipButton'

describe('RelationshipButton', () => {
  context('#getNextPriority', () => {
    it('returns a friendship priority if it is NOISE', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.NOISE)).to.equal(RELATIONSHIP_PRIORITY.FRIEND)
    })

    it('returns a noise priority if it is INACTIVE', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.INACTIVE)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })

    it('returns a noise priority if it is FRIEND', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.FRIEND)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })

    it('returns a noise priority if it is MUTE', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.MUTE)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })

    it('returns a noise priority if it is BLOCK', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.BLOCK)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })

    it('returns a noise priority if it is NONE', () => {
      expect(getNextPriority(RELATIONSHIP_PRIORITY.NONE)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })

    it('returns a noise priority if it is null', () => {
      expect(getNextPriority(null)).to.equal(RELATIONSHIP_PRIORITY.NOISE)
    })
  })
})

