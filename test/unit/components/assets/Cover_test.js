import { getSource } from '../../../../src/components/assets/Cover'

function tmpCover() {
  return {
    tmp: { url: 'cover-tmp.jpg', metadata: 'temporary' },
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.jpg', metadata: 'xhdpi' },
  }
}

function jpgCover() {
  return {
    optimized: { url: 'cover-optimized.jpg', metadata: 'optimized' },
    original: { url: 'cover-original.jpg', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.jpg', metadata: 'xhdpi' },
  }
}

function gifCover() {
  return {
    optimized: { url: 'cover-optimized.gif', metadata: 'optimized' },
    original: { url: 'cover-original.gif', metadata: 'original' },
    xhdpi: { url: 'cover-xhdpi.gif', metadata: 'xhdpi' },
  }
}

describe('Cover', () => {
  context('#getSource', () => {
    const props1 = { coverDPI: 'xhdpi', coverImage: null, useGif: false }
    const props2 = { coverDPI: 'xhdpi', coverImage: tmpCover(), useGif: false }
    const props3 = { coverDPI: 'xhdpi', coverImage: gifCover(), useGif: true }
    const props4 = { coverDPI: 'xhdpi', coverImage: jpgCover(), useGif: true }
    const props5 = { coverDPI: 'optimized', coverImage: jpgCover(), useGif: false }

    it('returns an empty string if the coverImage is null', () => {
      expect(getSource(props1)).to.equal('')
    })

    it('returns the source to the tmp url when it is available', () => {
      expect(getSource(props2)).to.equal('cover-tmp.jpg')
    })

    it('returns the source to the original when useGif is truen and the file is a gif', () => {
      expect(getSource(props3)).to.equal('cover-original.gif')
    })

    it('returns the regular size when useGif is true but it is not a gif', () => {
      expect(getSource(props4)).to.equal('cover-xhdpi.jpg')
    })

    it('returns the large size when the size changes', () => {
      expect(getSource(props5)).to.equal('cover-optimized.jpg')
    })
  })
})

