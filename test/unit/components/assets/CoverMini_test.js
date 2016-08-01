import { expect } from '../../../spec_helper'
import { getSource } from '../../../../src/components/assets/CoverMini'

function jpgCoverMini() {
  return {
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.jpg', metadata: 'xhdpi' },
  }
}

describe('CoverMini', () => {
  context('#getSource', () => {
    it('returns an empty string if the coverImage is null', () => {
      expect(getSource({ coverImage: null })).to.equal('')
    })

    it('returns the blob when the coverImage is a string', () => {
      expect(getSource({ coverImage: 'cover-blob.png' })).to.equal('cover-blob.png')
    })

    it('returns the xhdpi assets if the coverImage is defined', () => {
      expect(getSource({ coverImage: jpgCoverMini() })).to.equal('cover-xhdpi.jpg')
    })
  })
})

