import { expect } from '../spec_helper'
import * as api from '../../src/networking/api'

describe('api.js', () => {
  it('.s3CredentialsPath', () => {
    expect(api.s3CredentialsPath).to.match(/\/assets\/credentials$/)
  })

  it('.profilePath', () => {
    expect(api.profilePath).to.match(/\/profile$/)
  })

  it('.awesomePeoplePath', () => {
    expect(api.awesomePeoplePath).to.match(/\/discover\/users\/onboarding\?/)
  })

  it('.communitiesPath', () => {
    expect(api.communitiesPath).to.match(/\/interest_categories\/members\?/)
  })

  it('.relationshipBatchPath', () => {
    expect(api.relationshipBatchPath).to.match(/\/relationships\/batches$/)
  })

  it('.discoverRecommended', () => {
    expect(api.discoverRecommended).to.match(/\/users/)
  })

  it('.friendStream', () => {
    expect(api.friendStream).to.match(/\/streams\/friend\?/)
  })

  describe('#postDetail', () => {
    it('with an id', () => {
      expect(api.postDetail('666')).to.match(/\/posts\/666\?/)
    })

    it('with a token', () => {
      expect(api.postDetail('six_six_six')).to.match(/\/posts\/~six_six_six\?/)
    })
  })

  it('#commentsForPost', () => {
    expect(api.commentsForPost({id: 'suck_it'})).to.match(/\/posts\/suck_it\/comments\?/)
  })

  describe('#userDetail', () => {
    it('with an id', () => {
      expect(api.userDetail('666')).to.match(/\/users\/666\?/)
    })

    it('with a token', () => {
      expect(api.userDetail('six_six_six')).to.match(/\/users\/~six_six_six\?/)
    })
  })
})

