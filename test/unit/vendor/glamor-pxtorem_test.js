import pxtorem from '../../../src/vendor/glamor-pxtorem'

const fullInput = {
  position: 'absolute',
  top: '10Px',
  right: 0,
  bottom: '20PX',
  left: 16,
  zIndex: 9999,
  display: 'flex',
  flex: 14,
  flexGrow: 6,
  flexShrink: 5,
  flexOrder: 8,
  order: 8,
  width: 'calc(100% - 80px)',
  height: 'calc(100vh - 60px)',
  padding: '0 10px 1em',
  margin: '0 10px 20px 5px',
  fontSize: 24,
  lineHeight: 10.2,
  counterIncrement: 99,
  counterReset: 0,
  opacity: 0.5,
  color: 'rgba(255, 0, 255, 0.5)',
  border: '1px solid green',
  background: 'transparent url("/peoples/px/20px.jpg") no-repeat 40px 30px',
  transform: 'translate3d(20px, 100%, -10px)',
  transition: 'width 1s ease, opacity 250ms ease',
}

const fullOutput = {
  position: 'absolute',
  top: '10Px',
  right: 0,
  bottom: '20PX',
  left: '1rem',
  zIndex: 9999,
  display: 'flex',
  flex: 14,
  flexGrow: 6,
  flexShrink: 5,
  flexOrder: 8,
  order: 8,
  width: 'calc(100% - 5rem)',
  height: 'calc(100vh - 3.75rem)',
  padding: '0 0.625rem 1em',
  margin: '0 0.625rem 1.25rem 0.3125rem',
  fontSize: '1.5rem',
  lineHeight: 10.2,
  counterIncrement: 99,
  counterReset: 0,
  opacity: 0.5,
  color: 'rgba(255, 0, 255, 0.5)',
  border: '1px solid green',
  background: 'transparent url("/peoples/px/20px.jpg") no-repeat 2.5rem 1.875rem',
  transform: 'translate3d(1.25rem, 100%, -0.625rem)',
  transition: 'width 1s ease, opacity 250ms ease',
}

describe('pxtorem', () => {
  it('compares the big style objects', () => {
    const converted = pxtorem({ style: fullInput }).style
    const expected = fullOutput
    expect(converted).to.deep.equal(expected)
  })

  it('should replace the number unit with rem', () => {
    const style = { fontSize: 15 }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '0.9375rem' }
    expect(converted).to.deep.equal(expected)
  })

  it('should replace the px unit with rem', () => {
    const style = { fontSize: '15px' }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '0.9375rem' }
    expect(converted).to.deep.equal(expected)
  })

  it('should ignore a non px properties', () => {
    const style = { fontSize: '1.5em' }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '1.5em' }
    expect(converted).to.deep.equal(expected)
  })

  it('should handle values less than 0', () => {
    const style = { margin: '-16px', top: -20 }
    const converted = pxtorem({ style }).style
    const expected = { margin: '-1rem', top: '-1.25rem' }
    expect(converted).to.deep.equal(expected)
  })

  it('should not replace values in double quotes', () => {
    const style = { background: 'transparent url(16px.jpg) 32px 16px' }
    const converted = pxtorem({ style }).style
    const expected = { background: 'transparent url(16px.jpg) 2rem 1rem' }
    expect(converted).to.deep.equal(expected)
  })

  it('should fix the number to 5 decimal places', () => {
    const style = { fontSize: 10.66666656 }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '0.66667rem' }
    expect(converted).to.deep.equal(expected)
  })

  it('should ignore properties in the blacklist', () => {
    const style = { lineHeight: 40, opacity: 0.5, zIndex: 666, flexGrow: 6, order: 10 }
    const converted = pxtorem({ style }).style
    expect(converted).to.deep.equal(style)
  })

  it('should ignore properties with PX', () => {
    const style = { fontSize: '12PX' }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '12PX' }
    expect(converted).to.deep.equal(expected)
  })

  it('should ignore properties with Px', () => {
    const style = { fontSize: '12Px' }
    const converted = pxtorem({ style }).style
    const expected = { fontSize: '12Px' }
    expect(converted).to.deep.equal(expected)
  })
})

