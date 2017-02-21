/* eslint-disable max-len,func-names,no-console */
import nock from 'nock'
import jsdom from 'jsdom'
import kue from 'kue'
import app, { canPrerenderRequest } from '../../src/server-iso'
import { fetchOauthToken } from '../../oauth'
import handlePrerender from '../../src/prerender'

let queue = null

describe('isomorphically rendering on the server', () => {
  before(() => {
    queue = kue.createQueue({ redis: process.env[process.env.REDIS_PROVIDER] })
    queue.process('render', 1, (job, done) => {
      handlePrerender(job.data, done)
    })
  })

  after(() => {
    queue.shutdown(1000, (err) => {
      console.log('Kue shutdown: ', err)
    })
  })

  beforeEach(() => {
    nock(process.env.AUTH_DOMAIN)
      .post('/api/oauth/token')
      .reply(200, {
        access_token: '123abc456',
        refresh_token: '789def012',
        token_type: 'bearer',
        expires_in: 7200,
      })
  })

  describe('#canPrerenderRequest', () => {
    it.skip('returns false with loggedInPaths', () => {
      ['/following', '/invitations', '/settings', '/notifications'].forEach((path) => {
        expect(canPrerenderRequest({ url: path, get: () => 'false', cookies: {} })).to.be.false
      })
    })

    it('should return true with loggedOutPaths if not android or skip prerender set', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((path) => {
        expect(canPrerenderRequest({ url: path, get: () => 'false', cookies: {} })).to.be.true
      })
    })

    it('should return false with loggedOutPaths if skip prerender set', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((path) => {
        expect(canPrerenderRequest({
          url: path,
          get: () => 'false',
          cookies: { ello_skip_prerender: 'true' },
        })).to.be.false
      })
    })

    it('should return false with loggedOutPaths if it is Ello Android App', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((path) => {
        expect(canPrerenderRequest({
          url: path,
          get: () => 'Ello Android',
          cookies: {},
        })).to.be.false
      })
    })

    it('should return true with loggedOutPaths if missing user agent', () => {
      ['/mk', '/666', '/discover', '/search'].forEach((path) => {
        expect(canPrerenderRequest({
          url: path,
          get: () => undefined,
          cookies: {},
        })).to.be.true
      })
    })
  })

  describe('app', function () {
    this.timeout(15000)

    it.skip('isomorphically renders the homepage', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('isomorphically renders a user detail', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/666')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.UserDetail')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('isomorphically renders a post detail', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/666/post/my_sweet_token_here')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.PostDetail')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('isomorphically renders search', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/search')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.Search')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('isomorphically renders trending', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/discover/trending')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('isomorphically renders recent', (done) => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/discover/recent')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            console.log(res.text)
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
            done()
          })
      })
    })

    it.skip('does not isomorphically render when X-Skip-Prerender is true', (done) => {
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
            console.log(res.text)
            expect(document.querySelectorAll('main')).to.have.lengthOf(0)
            done()
          })
      })
    })
  })
})
