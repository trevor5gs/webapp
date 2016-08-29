import { stubPromotion } from '../../../support/stubs'
import { getSource } from '../../../../src/components/assets/Promotion'

describe('Promotion', () => {
  context('#getSource', () => {
    it('returns null if the promotion is null', () => {
      expect(getSource({ coverDPI: 'xhdpi', promotion: null })).to.be.null
    })

    it('returns the xhdpi version of the promotion', () => {
      const promotion = stubPromotion()
      expect(getSource({ coverDPI: 'xhdpi', promotion })).to.equal('666-cover-xhdpi.jpg')
    })
  })
})

