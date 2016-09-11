import {
  selectStreamType,
  selectStreamMappingType,
  selectStreamPostIdOrToken,
  // makeSelectStreamProps,
} from '../../../src/selectors/stream'

describe('stream selectors', () => {
  let stream
  beforeEach(() => {
    stream = {
      meta: { mappingType: 'stream.meta.mappingType' },
      payload: { postIdOrToken: 'stream.payload.postIdOrToken' },
      type: 'stream.type',
    }
  })

  afterEach(() => {
    stream = {}
  })

  context('#selectStreamType', () => {
    it('returns the stream.type', () => {
      const state = { stream }
      expect(selectStreamType(state)).to.equal('stream.type')
    })
  })

  context('#selectStreamMappingType', () => {
    it('returns the stream.meta.mappingType', () => {
      const state = { stream }
      expect(selectStreamMappingType(state)).to.equal('stream.meta.mappingType')
    })
  })

  context('#selectStreamPostIdOrToken', () => {
    it('returns the stream.payload.postIdOrToken', () => {
      const state = { stream }
      expect(selectStreamPostIdOrToken(state)).to.equal('stream.payload.postIdOrToken')
    })
  })

  context('#makeSelectStreamProps', () => {
    it('makeSelectStreamProps needs to be tested')
  })
})

