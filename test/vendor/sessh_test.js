import { expect } from '../spec_helper'
import Session from '../../src/vendor/sessh'

describe('Sessh', () => {
  it('can store values', () => {
    Session.setItem('foo', 'bar')
    expect(Session.getItem('foo')).to.equal('bar')
  })
  it('can clear values', () => {
    Session.removeItem('foo')
    expect(Session.getItem('foo')).to.be.undefined
  })
  it('can clear values with arity 2', () => {
    Session.removeItem('foo', 'bar')
    expect(Session.getItem('foo')).to.be.undefined
  })
})
