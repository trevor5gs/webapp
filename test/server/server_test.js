/* eslint-disable max-len,func-names */
import nock from 'nock'
import jsdom from 'jsdom'
import app, { canPrerenderRequest } from '../../src/server-iso'
import { fetchOauthToken } from '../../oauth'

describe('isomorphically rendering on the server', () => {
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
    it('returns false with loggedInPaths', () => {
      ['/following', '/invitations', '/settings', '/starred', '/notifications'].forEach((path) => {
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

    it('isomorphically renders the homepage', () =>
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
          })
      }),
    )

    it('isomorphically renders a user detail', () =>
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
          })
      }),
    )

    it('isomorphically renders a post detail', () => {
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
          })
      })
    })

    it('isomorphically renders search', () => {
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
          })
      })
    })

    it('isomorphically renders trending', () => {
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
          })
      })
    })

    it('isomorphically renders recent', () => {
      fetchOauthToken(() => {
        chai
          .request(app)
          .get('/discover/recent')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res).to.be.html
            const document = jsdom.jsdom(res.text)
            expect(document.querySelectorAll('main.Discover')).to.have.lengthOf(1)
          })
      })
    })

    it('does not isomorphically render when X-Skip-Prerender is true', () =>
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
          })
      }),
    )
  })
})

