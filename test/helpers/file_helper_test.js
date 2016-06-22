import { expect } from '../spec_helper'
import jsdom from 'jsdom'
import {
  getRestrictedSize,
  // orientImage,
} from '../../src/helpers/file_helper'


function getDOMString() {
  // 1x1 transparent gif
  const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
  const landscape = `<img class="landscape" src=${src} width=16 height=9 />`
  return `<html><body>${landscape}</body></html>`
}

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

  context('#orientImage', () => {
    const document = jsdom.jsdom(getDOMString())
    const landscapeImage = document.body.querySelector('.landscape')

    it('found the correct assets for testing', () => {
      expect(landscapeImage.width).to.equal(16)
      expect(landscapeImage.height).to.equal(9)
    })

    it('needs to test orienting of images')
    it('needs to test processing of images')
  })
})

