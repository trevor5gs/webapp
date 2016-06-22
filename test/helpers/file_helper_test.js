import { expect } from '../spec_helper'
import { getRestrictedSize } from '../../src/helpers/file_helper'

describe('file helpers', () => {
  context('#getRestrictedSize', () => {
    it('does not restrict the width and height', () => {
      const { width, height } = getRestrictedSize(800, 600, 2560, 1440)
      expect(width).to.equal(800)
      expect(height).to.equal(600)
    })

    it('restricts the width and height', () => {
      // The width/height are double maxWidth/maxHeight to keep ratios simple
      const { width, height } = getRestrictedSize(5120, 2880, 2560, 1440)
      expect(width).to.equal(2560)
      expect(height).to.equal(1440)
    })
  })
})

