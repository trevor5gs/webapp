/* eslint-disable max-len,func-names */
import { chai, expect } from './spec_helper'
import app from '../src/server-iso'
import { fetchOauthToken } from '../oauth'

describe('isomorphically rendering on the server', function () {
  this.timeout(5000)

  it('isomorphically renders the homepage', (done) => {
    fetchOauthToken(() => {
      chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.html
        // This gets rendered in with iso, not as part of the template
        expect(res.text).to.contain('<main')
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
        expect(res.text).to.contain('<div id="root"></div>')
        done()
      })
    })
  })
})
