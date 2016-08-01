import { expect } from '../../../spec_helper'
import { getSource } from '../../../../src/components/assets/Avatar'

function tmpAvatar() {
  return {
    tmp: { url: 'avatar-tmp.jpg', metadata: 'temporary' },
    original: { url: 'avatar-original.jpg', metadata: 'original' },
    large: { url: 'avatar-large.jpg', metadata: 'large' },
    regular: { url: 'avatar-regular.jpg', metadata: 'regular' },
    small: { url: 'avatar-small.jpg', metadata: 'small' },
  }
}

function jpgAvatar() {
  return {
    original: { url: 'avatar-original.jpg', metadata: 'original' },
    large: { url: 'avatar-large.jpg', metadata: 'large' },
    regular: { url: 'avatar-regular.jpg', metadata: 'regular' },
    small: { url: 'avatar-small.jpg', metadata: 'small' },
  }
}

function gifAvatar() {
  return {
    original: { url: 'avatar-original.gif', metadata: 'original' },
    large: { url: 'avatar-large.gif', metadata: 'large' },
    regular: { url: 'avatar-regular.gif', metadata: 'regular' },
    small: { url: 'avatar-small.gif', metadata: 'small' },
  }
}

describe('Avatar', () => {
  context('#getSource', () => {
    const props1 = { sources: null, size: 'regular', useGif: false }
    const props2 = { sources: tmpAvatar(), size: 'regular', useGif: false }
    const props3 = { sources: gifAvatar(), size: 'regular', useGif: true }
    const props4 = { sources: jpgAvatar(), size: 'regular', useGif: true }
    const props5 = { sources: jpgAvatar(), size: 'large', useGif: false }

    it('returns an empty string if the sources is null', () => {
      expect(getSource(props1)).to.equal('')
    })

    it('returns the source to the tmp url when it is available', () => {
      expect(getSource(props2)).to.equal('avatar-tmp.jpg')
    })

    it('returns the source to the original when useGif is truen and the file is a gif', () => {
      expect(getSource(props3)).to.equal('avatar-original.gif')
    })

    it('returns the regular size when useGif is true but it is not a fig', () => {
      expect(getSource(props4)).to.equal('avatar-regular.jpg')
    })

    it('returns the large size when the size changes', () => {
      expect(getSource(props5)).to.equal('avatar-large.jpg')
    })
  })
})

