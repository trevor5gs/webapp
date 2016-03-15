import { expect, getRenderedComponent } from '../../spec_helper'
import { Notifications } from '../../../src/containers/notifications/Notifications'
import Session from '../../../src/vendor/sessh'

describe('Notifications', () => {
  describe('#render', () => {
    it('clears the session category', () => {
      getRenderedComponent(Notifications, { params: { category: null } })
      expect(Session.getItem('notifications_filter')).to.be.undefined
    })
    it('sets the session category', () => {
      getRenderedComponent(Notifications, { params: { category: 'mention' } })
      expect(Session.getItem('notifications_filter')).to.equal('mention')
    })
  })
})
