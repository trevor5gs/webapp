/* eslint-disable max-len,func-names */
import { chai, expect } from './spec_helper'
import app, { canPrerenderRequest } from '../src/server-iso'
import { fetchOauthToken } from '../oauth'
import jsdom from 'jsdom'

describe('isomorphically rendering on the server', function () {
  this.timeout(5000)

  context('#canPrerenderRequest', () => {
    it('returns false with loggedInPaths', () => {
      ['/following', '/invitations', '/settings', '/starred', '/notifications'].forEach((path) => {
        expect(canPrerenderRequest({ url: path, get: () => 'false' })).to.be.false
      })
    })

    it('should return true with loggedOutPaths', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((path) => {
        expect(canPrerenderRequest({ url: path, get: () => 'false' })).to.be.true
      })
    })
  })

  it('isomorphically renders the homepage', (done) => {
    fetchOauthToken(() => {
      chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.html
        const document = jsdom.jsdom(res.text)
        expect(document.querySelectorAll('main')).to.have.lengthOf(1)
        done()
      })
    })
  })

  it('does not isomorphically render when X-Skip-Prerender is true', (done) => {
    fetchOauthToken(() => {
      chai
      .request(app)
      .get('/')
      .set('X-Skip-Prerender', true)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.html
        const document = jsdom.jsdom(res.text)
        expect(document.querySelectorAll('main')).to.have.lengthOf(0)
        done()
      })
    })
  })
})
