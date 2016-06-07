import { expect } from '../spec_helper'
import { AUTHENTICATION_PROMOTIONS } from '../../src/constants/promotions/authentication'
import { LOGGED_IN_PROMOTIONS } from '../../src/constants/promotions/logged_in'
import { LOGGED_OUT_PROMOTIONS } from '../../src/constants/promotions/logged_out'

function isValidAuthenticationPromotionKey(key) {
  const validKeys = [
    'username',
    'avatar',
    'coverImage',
  ]
  return validKeys.indexOf(key) > -1
}

function hasValidAuthenticationPromotionKeys(promotion) {
  return (
    typeof promotion !== 'undefined' &&
    Object.keys(promotion).every(isValidAuthenticationPromotionKey)
  )
}

function isValidSignedOutPromotionKey(key) {
  const validKeys = [
    'username',
    'caption',
    'avatar',
    'coverImage',
    'cta',
  ]
  return validKeys.indexOf(key) > -1
}

function hasValidSignedOutPromotionKeys(promotion) {
  return (
    typeof promotion !== 'undefined' &&
    Object.keys(promotion).every(isValidSignedOutPromotionKey)
  )
}

function hasValidUsername(promotion) {
  return (
    promotion &&
    promotion.username.length
  )
}

function hasValidCaption(promotion) {
  return (
    promotion &&
    promotion.caption.type === 'h1' &&
    promotion.caption.props &&
    promotion.caption.props.children &&
    promotion.caption.props.children.length
  )
}

function hasValidCallToAction(promotion) {
  const { cta } = promotion
  if (!cta) { return true }
  const { href, target } = cta.props
  const hasValidType = cta.type === 'a'
  const hasValidHref = href && (href.indexOf('.') > -1 || href.indexOf('/') > -1)
  const hasValidTarget = !target || target === '_blank'
  return hasValidType && hasValidHref && hasValidTarget
}

function hasValidAvatar(promotion) {
  return (
    promotion &&
    promotion.avatar &&
    promotion.avatar.regular &&
    promotion.avatar.regular.url &&
    promotion.avatar.regular.url.indexOf('user') > -1 &&
    promotion.avatar.regular.url.indexOf('avatar') > -1 &&
    promotion.avatar.regular.url.indexOf('ello-regular') > -1
  )
}

function hasValidCoverImageKeys(key) {
  const validKeys = [
    'hdpi',
    'xhdpi',
    'optimized',
  ]
  return validKeys.indexOf(key) > -1
}

function hasValidCoverImage(promotion) {
  return (
    promotion &&
    promotion.coverImage &&
    Object.keys(promotion.coverImage).every(hasValidCoverImageKeys)
  )
}


function hasValidHDPICoverImage(promotion) {
  return (
    promotion.coverImage.hdpi.url &&
    promotion.coverImage.hdpi.url.indexOf('ello-hdpi-') > -1 &&
    promotion.coverImage.hdpi.url.indexOf('assets.ello.co') > -1
  )
}

function hasValidXHDPICoverImage(promotion) {
  return (
    promotion.coverImage.xhdpi.url &&
    promotion.coverImage.xhdpi.url.indexOf('ello-xhdpi-') > -1 &&
    promotion.coverImage.xhdpi.url.indexOf('assets.ello.co') > -1
  )
}


function hasValidOptimizedCoverImage(promotion) {
  return (
    promotion.coverImage.optimized.url &&
    promotion.coverImage.optimized.url.indexOf('ello-optimized-') > -1 &&
    promotion.coverImage.optimized.url.indexOf('assets.ello.co') > -1
  )
}


describe('promotion_types.js', () => {
  describe('AUTHENTICATION_PROMOTIONS', () => {
    it('has a length within the range of 1-20', () => {
      expect(AUTHENTICATION_PROMOTIONS.length > 0).to.be.true
      expect(AUTHENTICATION_PROMOTIONS.length <= 20).to.be.true
    })

    it('has the appropriate keys for each index: username, avatar, coverImage', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidAuthenticationPromotionKeys)).to.be.true
    })

    it('has a valid username for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidUsername)).to.be.true
    })

    it('has a valid avatar for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidAvatar)).to.be.true
    })

    it('has valid cover image assets for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidCoverImage)).to.be.true
    })

    it('has valid hdpi cover image asset for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidHDPICoverImage)).to.be.true
    })

    it('has valid xhdpi cover image asset for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidXHDPICoverImage)).to.be.true
    })

    it('has valid optimized cover image asset for each index', () => {
      expect(AUTHENTICATION_PROMOTIONS.every(hasValidOptimizedCoverImage)).to.be.true
    })
  })

  describe('LOGGED_IN_PROMOTIONS', () => {
    it('has a length within the range of 1-20', () => {
      expect(LOGGED_IN_PROMOTIONS.length > 0).to.be.true
      expect(LOGGED_IN_PROMOTIONS.length <= 20).to.be.true
    })

    it('has the appropriate keys for each index: username, avatar, coverImage', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidSignedOutPromotionKeys)).to.be.true
    })

    it('has a valid username for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidUsername)).to.be.true
    })

    it('has a valid caption for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidCaption)).to.be.true
    })

    it('has a valid call to action for each index it is defined', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidCallToAction)).to.be.true
    })

    it('has a valid avatar for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidAvatar)).to.be.true
    })

    it('has valid cover image assets for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidCoverImage)).to.be.true
    })

    it('has valid hdpi cover image asset for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidHDPICoverImage)).to.be.true
    })

    it('has valid xhdpi cover image asset for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidXHDPICoverImage)).to.be.true
    })

    it('has valid optimized cover image asset for each index', () => {
      expect(LOGGED_IN_PROMOTIONS.every(hasValidOptimizedCoverImage)).to.be.true
    })
  })

  describe('LOGGED_OUT_PROMOTIONS', () => {
    it('has a length within the range of 1-20', () => {
      expect(LOGGED_OUT_PROMOTIONS.length > 0).to.be.true
      expect(LOGGED_OUT_PROMOTIONS.length <= 20).to.be.true
    })

    it('has the appropriate keys for each index: username, avatar, coverImage', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidSignedOutPromotionKeys)).to.be.true
    })

    it('has a valid username for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidUsername)).to.be.true
    })

    it('has a valid caption for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidCaption)).to.be.true
    })

    it('has a valid call to action for each index it is defined', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidCallToAction)).to.be.true
    })

    it('has a valid avatar for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidAvatar)).to.be.true
    })

    it('has valid cover image assets for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidCoverImage)).to.be.true
    })

    it('has valid hdpi cover image asset for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidHDPICoverImage)).to.be.true
    })

    it('has valid xhdpi cover image asset for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidXHDPICoverImage)).to.be.true
    })

    it('has valid optimized cover image asset for each index', () => {
      expect(LOGGED_OUT_PROMOTIONS.every(hasValidOptimizedCoverImage)).to.be.true
    })
  })
})

