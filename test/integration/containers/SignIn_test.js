/* eslint no-param-reassign: ["error", { props: false } ] */
import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { pretendServer } from '../spec_helper.js'
import { createElloStore } from '../../../src/store'
import TextControl from '../../../src/components/forms/TextControl'
import PasswordControl from '../../../src/components/forms/PasswordControl'
import SignIn from '../../../src/containers/authentication/SignIn'
import { PROMOTIONS } from '../../../src/constants/action_types'

describe('SignIn', function () {
  beforeEach(function () {
    this.server = pretendServer((server) => {
      server.post(`${ENV.AUTH_DOMAIN}/api/oauth/login`, () => {
        const token = JSON.stringify({ sub: 'me' })
        // The token body must be base64-encoded.  It's the only thing that jwt-decode cares about
        const fakeJWT = `blah.${btoa(token)}.blah`
        return [
          200,
          {},
          {
            access_token: fakeJWT,
            createdAt: 1000,
            expiresIn: 7200,
          },
        ]
      })
    })
  })

  afterEach(function () {
    this.server.shutdown()
  })

  it('signs you in', function () {
    const store = createElloStore()

    store.dispatch({
      type: PROMOTIONS.AUTHENTICATION_SUCCESS,
      payload: {
        response: [
          {
            username: 'foobar',
            avatar: {
              regular: {
                url: 'avatarImageForFun',
              },
            },
            coverImage: {
              hdpi: {
                url: 'hdpiImageForFun',
              },
              xhdpi: {
                url: 'xhdpiImageForFun',
              },
              optimized: {
                url: 'optimizedImageForFun',
              },
            },
          },
        ],
      },
    })
    const { sagaTask } = store

    const miniApp = (
      <SignIn />
    )

    const wrapper = mount(miniApp, { context: { store } })

    const emailInput = wrapper.find(TextControl)
    emailInput.find('input').simulate('change', {
      target: { value: 'word' },
    })

    const passwordInput = wrapper.find(PasswordControl)
    passwordInput.find('input').simulate('change', {
      target: { value: 'password' },
    })
    wrapper.find('form').simulate('submit')

    store.close()
    return sagaTask.done.then(() => {
      const { authentication } = store.getState()
      expect(authentication.isLoggedIn).to.equal(true)
    })
  })
})
